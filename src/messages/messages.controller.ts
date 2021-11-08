import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(
    @Param('id') chatId: string,
    @CurrentUser('userId') userId: User,
    @Body() messageDto: MessageDto,
  ) {
    return this.messagesService.create(chatId, userId, messageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find/:id')
  findLike(
    @Param('id') chatId: string,
    @Body() messageDto: MessageDto,
  ) {
    return this.messagesService.findLike(chatId, messageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.messagesService.remove(+id, userId);
  }
}
