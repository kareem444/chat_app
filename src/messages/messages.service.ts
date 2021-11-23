import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/chats/entities/chat.entity';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
  ) { }

  async create(
    chatId,
    userId,
    messageDto: MessageDto,
    file: Express.Multer.File,
  ) {
    const chat = await this.chatRepo.findOneOrFail(chatId);
    if (chat) {
      if (file != null || messageDto.content !== '') {
        const newMessage = this.messageRepo.create({
          content: messageDto.content === '' ? null : messageDto.content,
          image: file == null ? null : file.filename,
          userId: userId,
          chat: chatId,
        });
        await this.messageRepo.save(newMessage);
        if (messageDto.content !== '') {
          await this.chatRepo.update(chatId, {
            last_messaeg: messageDto.content,
          });
        } else {
          await this.chatRepo.update(chatId, {
            last_messaeg: 'new image.',
          });
        }
        return {
          message: 'messge created successfully',
          newMessage,
        };
      } else {
        throw new NotAcceptableException();
      }
    }
  }

  async findAll(chatId, userId , skip) {
    const chat = await this.chatRepo.findOneOrFail({
      where: [
        { id: chatId, user_one: userId },
        { id: chatId, user_two: userId },
      ],
    });
    if (chat) {
      const messages = await this.messageRepo.find({
        where: { chat: chatId },
        order: { created_at: 'DESC' },
        take: 40,
        skip: skip
      });
      return {
        message: 'success to get all messages',
        messages,
      };
    } else {
      throw NotFoundException;
    }
  }
  async findGallary(chatId, userId) {
    const chat = await this.chatRepo.findOneOrFail({
      where: [
        { id: chatId, user_one: userId },
        { id: chatId, user_two: userId },
      ],
    });
    if (chat) {
      const images = await this.messageRepo.find({
        where: { chat: chatId, image: Not(IsNull()) },
        order: { created_at: 'DESC' },
        select: ['image', 'id', 'userId', 'created_at'],
      });
      return {
        message: 'success to get all messages',
        images,
      };
    }
  }
  async findLike(chatId, messageDto: MessageDto) {
    return await this.messageRepo.find({
      where: { chat: chatId, content: Like(`%${messageDto.content}%`) },
      select: ['id', 'content', 'created_at', 'userId'],
    });
  }

  async remove(messageId) {
    const fs = require('fs');
    const { promisify } = require('util')
    const unlinkAsync = promisify(fs.unlink)

    const message = await this.messageRepo.findOne(messageId);
    if (message.image != null) {
      await unlinkAsync(`assets/images/messages/${message.image}`)
    }
    const deleteMessage = await this.messageRepo.delete({ id: messageId });
    if (deleteMessage.affected === 1) {
      return {
        message: 'deleted successfully',
      };
    } else {
      throw new NotFoundException();
    }
  }
}
