import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  acceptFriendReques(
    @Param('id') friendId: string,
    @CurrentUser('userId') userId: User,
  ) {
    return this.friendsService.acceptFriendReques(friendId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend')
  findOne(@CurrentUser('userId') userId: User, @Body() body: string) {
    return this.friendsService.findOne(userId, body.search.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') friendId: string, @CurrentUser('userId') userId: User) {
    return this.friendsService.remove(+friendId, userId);
  }
}
