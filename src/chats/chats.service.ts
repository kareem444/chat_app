import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Any, In, IsNull, Not, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chatRepo: Repository<Chat>,
    private usersService: UsersService,
  ) { }

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
        const getChat = await this.findOne(userId, friendId);
        return {
          message: 'chat created successfully',
          getChat,
        };
      } else {
        if (chat.user_one_hide_chat === userId) {
          await this.chatRepo.update(chat.id, { user_one_hide_chat: 0 });
        } else {
          await this.chatRepo.update(chat.id, { user_two_hide_chat: 0 });
        }
        const getChat = await this.findOne(userId, friendId);

        return {
          message: 'show the chat',
          getChat
        };
      }
    } else {
      throw new BadRequestException();
    }
  }

  async findOne(userId, friendId) {
    const chat = await this.chatRepo
      .createQueryBuilder('chat')
      .where({
        user_one: userId,
        user_two: friendId,
        user_one_hide_chat: Not(userId),
        user_two_hide_chat: Not(userId),
      })
      .orWhere({
        user_one: friendId,
        user_two: userId,
        user_one_hide_chat: Not(userId),
        user_two_hide_chat: Not(userId),
      })
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .leftJoinAndSelect('chat.message', 'message')
      .select([
        'chat.id',
        'user1.id',
        'user1.name',
        'user1.image',
        'user2.id',
        'user2.name',
        'user2.image',
      ])
      .getOne();

    return {
      message: 'get the chat',
      chat,
    };
  }

  async findAll(userId) {
    const chats = await this.chatRepo
      .createQueryBuilder('chat')
      .where({
        user_one: userId,
        user_one_hide_chat: Not(userId),
      })
      .orWhere({
        user_two: userId,
        user_two_hide_chat: Not(userId),
      })
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .leftJoinAndSelect('chat.message', 'message')
      .select([
        'chat.id',
        'chat.last_messaeg',
        'chat.last_messaeg_created_at',
        'user1.id',
        'user1.name',
        'user1.image',
        'user2.id',
        'user2.name',
        'user2.image',
      ])
      .orderBy('message.created_at', 'DESC')
      .getManyAndCount();

    return {
      message: 'get all chats',
      chats: chats,
    };
  }

  async findHidedChat(userId) {
    const chats = await this.chatRepo
      .createQueryBuilder('chat')
      .where({
        user_one: userId,
        user_one_hide_chat: userId,
      })
      .orWhere({
        user_two: userId,
        user_two_hide_chat: userId,
      })
      .leftJoinAndSelect('chat.user1', 'user1')
      .leftJoinAndSelect('chat.user2', 'user2')
      .leftJoinAndSelect('chat.message', 'message')
      .select([
        'chat.id',
        'chat.last_messaeg',
        'chat.last_messaeg_created_at',
        'user1.id',
        'user1.name',
        'user1.image',
        'user2.id',
        'user2.name',
        'user2.image',
      ])
      .orderBy('message.created_at', 'DESC')
      .getManyAndCount();

    return {
      message: 'get all chats',
      chats: chats,
    };
  }

  async hideChat(chatId, userId) {
    const chat = await this.chatRepo.findOneOrFail(chatId);
    if (chat) {
      if (chat.user_one_hide_chat == 0) {
        await this.chatRepo.update(chat.id, { user_one_hide_chat: userId });
      } else {
        await this.chatRepo.update(chat.id, { user_two_hide_chat: userId });
      }
      return {
        message: "succes hiding chat"
      }
    } else {
      throw new NotFoundException;
    }
  }

  async unHideChat(chatId, userId) {
    const chat = await this.chatRepo.findOneOrFail(chatId);
    if (chat) {
      if (chat.user_one_hide_chat == userId) {
        await this.chatRepo.update(chat.id, { user_one_hide_chat: 0 });
      } else {
        await this.chatRepo.update(chat.id, { user_two_hide_chat: 0 });
      }
      return {
        message: "succes hiding chat"
      }
    } else {
      throw new NotFoundException;
    }
  }
}
