import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from 'src/chats/entities/chat.entity'
import { Like, Repository } from 'typeorm'
import { MessageDto } from './dto/message.dto'
import { Message } from './entities/message.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
  ) { }

  async create(chatId, userId, messageDto: MessageDto) {
    const chat = await this.chatRepo.findOneOrFail(chatId)
    if (chat) {
      const newMesage = this.messageRepo.create({
        content: messageDto.content,
        user: userId,
        chat: chatId,
      })
      this.messageRepo.save(newMesage)
      return {
        message: 'messge created successfully',
      }
    }
  }

  async findLike(chatId, messageDto: MessageDto) {
    return await this.messageRepo.find({
      where: { chat: chatId, content: Like(`%${messageDto.content}%`) },
    })
  }

  async remove(messageId, userId) {
    const deleteMessage = await this.messageRepo.delete({
      id: messageId,
      user: userId,
    })
    if (deleteMessage.affected === 1) {
      return {
        message: 'deleted successfully',
      }
    } else {
      throw new NotFoundException()
    }
  }
}
