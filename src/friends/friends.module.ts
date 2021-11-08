import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FriendRequestsModule],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule { }
