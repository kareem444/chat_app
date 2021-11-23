import { Controller, Get, Param, UseGuards, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('create/:id')
  create(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.create(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('userId') userId: User) {
    return this.chatsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat/:id')
  findOne(@Param('id') friendId: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.findOne(userId, friendId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hide')
  findHidedChat(@CurrentUser('userId') userId: User) {
    return this.chatsService.findHidedChat(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('hide/:id')
  hideChat(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.hideChat(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('unhide/:id')
  unHideChat(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.unHideChat(+id, userId);
  }
}
