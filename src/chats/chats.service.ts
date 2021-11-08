import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(@InjectRepository(Chat) private chatRepo: Repository<Chat>) { }

  async create(friendId, userId) {
    if (friendId != userId) {
      const chat = await this.chatRepo.findOne({
        where: [
          { user_one: friendId, user_two: userId },
          { user_one: userId, user_two: friendId },
        ],
      });
      if (!chat) {
        const newChat = this.chatRepo.create({
          user_one: userId,
          user_two: friendId,
        });

        await this.chatRepo.save(newChat);
        return {
          message: 'chat created successfully',
        };
      } else {
        if (chat.user_one_hide_chat === userId) {
          await this.chatRepo.update(chat.id, { user_one_hide_chat: 0 });
        } else {
          await this.chatRepo.update(chat.id, { user_two_hide_chat: 0 });
        }

        return {
          message: "show the chat"
        }
      }
    } else {
      throw new BadRequestException();
    }
  }

  async findAll(userId) {
    const chats = await this.chatRepo.findAndCount({
      where: [
        {
          user_one: userId,
          user_one_hide_chat: Not(userId),
          user_two_hide_chat: Not(userId),
        },
        {
          user_two: userId,
          user_one_hide_chat: Not(userId),
          user_two_hide_chat: Not(userId),
        },
      ],
    });
    return {
      message: 'get all chats',
      chats: chats[0],
      count: chats[1],
    };
  }

  async hideChat(chatId, userId) {
    const chat = await this.chatRepo.findOneOrFail(chatId);
    if (chat) {
      if (chat.user_one_hide_chat === null) {
        await this.chatRepo.update(chat.id, { user_one_hide_chat: userId });
      } else {
        await this.chatRepo.update(chat.id, { user_two_hide_chat: userId });
      }
    }
  }
}
