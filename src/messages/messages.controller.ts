import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadMessageImageOptions } from 'src/common/file_options';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', uploadMessageImageOptions))
  @Post(':id')
  create(
    @Param('id') chatId: string,
    @CurrentUser('userId') userId: User,
    @Body() messageDto: MessageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messagesService.create(chatId, userId, messageDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('gallary/:id')
  findGallary(
    @Param('id') chatId: string,
    @CurrentUser('userId') userId: User,
  ) {
    return this.messagesService.findGallary(chatId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('find/:id')
  findLike(@Param('id') chatId: string, @Body() messageDto: MessageDto) {
    return this.messagesService.findLike(chatId, messageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id?')
  findAll(
    @Param('id') chatId: string,
    @Query('skip') skip: number,
    @CurrentUser('userId') userId: User,
  ) {
    return this.messagesService.findAll(chatId, userId, skip);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }

  @Get('/image/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './assets/images/messages' });
  }
}
