import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly friendReqService: FriendRequestsService,
  ) { }

  async acceptFriendReques(friendId, userId) {
    const friendReq = await this.friendReqService.findUserFriendOneRequest(
      friendId,
      userId,
    );
    if (friendReq) {
      const user = await this.userRepo.findOne(userId, {
        relations: ['friends'],
      });
      const friend = await this.userRepo.findOne(friendId);
      user.friends = [...user.friends, friend];
      await this.userRepo.save(user);
      await this.friendReqService.removeAll(friendId, userId);
      return {
        message: 'success add friend',
      };
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(userId) {
    const user = await this.userRepo.findOne(userId, {
      relations: ['friends'],
    });
    return {
      message: 'success getting all friends',
      count: user.friends.length,
      friends: user.friends,
    };
  }

  async findOne(userId, emailOrName: string): Promise<{ message: string; search: any[]; }> {
    let result = [];
    let friends = await this.findAll(userId);
    friends.friends.forEach((friend) => {
      if (
        friend.email.includes(emailOrName) ||
        friend.name.includes(emailOrName)
      ) {
        result.push(friend);
      }
    });

    return {
      message: 'search for friend',
      search: result,
    };
  }

  async remove(friendId, userId) {
    let result = [];
    const user = await this.userRepo.findOne(userId, { relations: ["friends"] })
    user.friends.forEach((friend) => {
      if (friend.id !== friendId) {
        result.push(friend)
      }
    });
    user.friends = result;
    this.userRepo.save(user);
    return {
      message: "success deleting friend"
    }
  }
}
