import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendReqRepo: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async create(friendId, userId) {
    if (friendId != userId) {
      const friendCheck = await this.userRepo.findOneOrFail(friendId);
      if (friendCheck) {
        const friendReq = await this.friendReqRepo.findOne({
          where: { user_from: userId, user_to: friendId },
        });

        if (friendReq) {
          throw new NotAcceptableException();
        } else {
          const newFriendReq = await this.friendReqRepo.create({
            user_from: userId,
            user_to: friendId,
          });
          this.friendReqRepo.save(newFriendReq);
          return {
            message: 'success create friend request',
          };
        }
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new ForbiddenException();
    }
  }

  async findAll(userId) {
    const friendsReq = await this.friendReqRepo
      .createQueryBuilder('firend_request')
      .where({ user_to: userId })
      .leftJoinAndSelect('firend_request.userFrom', 'user_from')
      .select([
        'firend_request.id',
        'user_from.id',
        'user_from.name',
        'user_from.email',
        'user_from.image',
      ])
      .getMany();

    return {
      message: 'success get friend requests',
      count:friendsReq.length,
      friend_requests: friendsReq,
    };
  }

  async findUserFriendOneRequest(friendId, userId) {
    return await this.friendReqRepo.findOne({
      where: { user_to: userId, user_from: friendId },
    });
  }

  async remove(id: number) {
    const deleteFriendReq = await this.friendReqRepo.delete(id);
    if (deleteFriendReq.affected == 1) {
      return { message: 'sueccess deletting friend request' };
    } else {
      return { message: 'error some thing went wrong!' };
    }
  }

  async removeAll(friendId, userId) {
    await this.friendReqRepo.delete({
      user_from: In([userId, friendId]),
      user_to: In([userId, friendId]),
    });
  }
}
