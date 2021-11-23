import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest, User]), UsersModule, FriendRequestsModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports:[FriendRequestsService]
})
export class FriendRequestsModule { }
