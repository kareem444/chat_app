import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { FriendRequestsService } from './friend-requests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  create(@Param('id') friendId: string, @CurrentUser('userId') userId: User) {
    return this.friendRequestsService.create(friendId,userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('userId') userId: User) {
    return this.friendRequestsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendRequestsService.remove(+id);
  }
}
