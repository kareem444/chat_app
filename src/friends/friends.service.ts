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
      const friend = await this.userRepo.findOne(friendId, {
        relations: ['friends'],
      });
      user.friends = [...user.friends, friend];
      friend.friends = [...friend.friends, user];
      await this.userRepo.save(user);
      await this.userRepo.save(friend);
      await this.friendReqService.removeAll(friendId, userId);
      return {
        message: 'success add friend',
      };
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(userId) {
    const friends = await this.userRepo
      .createQueryBuilder('user')
      .where({ id: userId })
      .leftJoinAndSelect('user.friends', 'friends')
      .select(['friends.id', 'friends.email', 'friends.name', 'friends.image'])
      .getRawMany();

    if (friends[0].friends_id !== null) {
      return {
        message: 'success getting all friends',
        count: friends.length,
        friends,
      };
    } else {
      return {
        message: 'no friends yet',
        count: 0,
        friends: [],
      };
    }
  }

  async findOne(userId, emailOrName: string) {
    let result = [];
    let friends = await this.findAll(userId);
    friends.friends.forEach((friend) => {
      if (
        friend.friends_email.includes(emailOrName) ||
        friend.friends_name.includes(emailOrName)
      ) {
        result.push(friend);
      }
    });

    return {
      message: 'search for friend',
      search_result: result,
    };
  }

  async remove(friendId, userId) {
    const user = await this.userRepo
      .createQueryBuilder()
      .relation(User, 'friends')
      .of([userId, friendId])
      .remove([friendId, userId]);

    return {
      message: 'success deleting friend',
      user,
    };
  }
}
