import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) { }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  create(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.create(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser('userId') userId: User) {
    return this.chatsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  hideChat(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.chatsService.hideChat(+id, userId);
  }
}
