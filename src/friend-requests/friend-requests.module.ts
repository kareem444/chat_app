import { Module } from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { FriendRequestsController } from './friend-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UsersModule, FriendRequestsModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
  exports:[FriendRequestsService]
})
export class FriendRequestsModule { }
