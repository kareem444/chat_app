import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { In, Repository } from 'typeorm';
import { FriendRequest } from './entities/friend-request.entity';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendReqRepo: Repository<FriendRequest>,
    private readonly usersService: UsersService,
  ) { }

  async create(friendId, userId) {
    if (friendId != userId) {
      const friendCheck = await this.usersService.findOne(friendId);
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
    const friendsReq = await this.friendReqRepo.find({ where: { user_to: userId } })
    return {
      message: "success get friend requests",
      friend_requests: friendsReq
    }
  }

  async findUserFriendOneRequest(friendId, userId) {
    return await this.friendReqRepo.findOne({
      where: { user_to: userId, user_from: friendId },
    })
  }

  async remove(id: number) {
    const deleteFriendReq = await this.friendReqRepo.delete(id);
    if (deleteFriendReq.affected == 1) {
      return { message: "sueccess deletting friend request" }
    } else {
      return { message: "error some thing went wrong!" }
    }
  }

  async removeAll(friendId, userId) {
    await this.friendReqRepo.delete({
      user_from: In([userId, friendId]),
      user_to: In([userId, friendId]),
    });
  }
}
