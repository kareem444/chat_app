import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/current_user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadProfileImageOptions } from 'src/common/file_options';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image', uploadProfileImageOptions))
  uploadImage(
    @CurrentUser('userId') userId: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadImage(userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser('userId') userId: User) {
    return this.usersService.profile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  findByEmailOrName(@Body() body: string) {
    return this.usersService.findByEmailOrName(body.search.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: User) {
    return this.usersService.findOne(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+req.user.user.userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('image/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res) {
    return res.sendFile(image, { root: './assets/images/profile' });
  }
}
