import {
  HttpException,
  HttpStatus,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findByEmail(createUserDto.email);
    if (user.length < 1) {
      return this.authService
        .hashPassword(createUserDto.password.toString())
        .then(async (res) => {
          let user = new User();
          user.name = createUserDto.name;
          user.email = createUserDto.email;
          user.password = res;
          await this.userRepository.save(user);
          return this.authService.login(user);
        });
    } else {
      throw new HttpException(
        'This Email Is Already Exisit',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.findByEmail(loginUserDto.email);
    if (user.length >= 1) {
      const isMatch = await this.authService.checkValidatedPassword(
        loginUserDto.password,
        user[0].password.toString(),
      );
      if (isMatch) {
        return this.authService.login(user[0]);
      } else {
        throw new HttpException(
          'check email or password again',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException('This Email Is Not Exist', HttpStatus.NOT_FOUND);
    }
  }

  async uploadImage(userId, file: Express.Multer.File) {
    const upload = await this.userRepository.update(
      { id: userId },
      {
        image: file.filename,
      },
    );
    if (upload.affected === 1) {
      return { message: 'success updating profile pic', image: file.filename };
    } else {
      throw new UnsupportedMediaTypeException();
    }
  }

  async profile(userId) {
    return await this.userRepository.findOneOrFail(userId, {
      select: ['id', 'email', 'name', 'image'],
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['friends'] });
  }

  async findByEmailOrName(emailOrName: string): Promise<any> {
    if (emailOrName.length > 0) {
      return await this.userRepository.find({
        where: [
          { name: Like(`%${emailOrName}%`) },
          { email: Like(`%${emailOrName}%`) },
        ],
        take: 10,
      });
    } else {
      return [];
    }
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userRepository.find({ where: { email: email } });
  }

  async findOne(id: number, userId) {
    let friend: boolean = false;
    let friendRequestToMe: boolean = false;
    let friendRequestForHim: boolean = false;
    let friendRequestToMeId;
    let friendRequestForHimId;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: id })
      .leftJoinAndSelect('user.friends', 'friends')
      .leftJoinAndSelect('user.friendRequestUserFrom', 'friendRequestUserFrom')
      .leftJoinAndSelect('user.friendRequestUserTo', 'friendRequestUserTo')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.image',
        'friends.id',
        'friends.name',
        'friends.email',
        'friends.image',
        'friendRequestUserFrom.id',
        'friendRequestUserFrom.user_to',
        'friendRequestUserTo.id',
        'friendRequestUserTo.user_from',
      ])
      .getOne();

    for (let index = 0; index < user.friends.length; index++) {
      const element = user.friends[index];
      if (element.id === userId) {
        friend = true;
        break;
      }
    }
    for (let index = 0; index < user.friendRequestUserFrom.length; index++) {
      const element = user.friendRequestUserFrom[index];
      if (element.user_to === userId) {
        friendRequestToMe = true;
        friendRequestToMeId = element.id;
        break;
      }
    }
    for (let index = 0; index < user.friendRequestUserTo.length; index++) {
      const element = user.friendRequestUserTo[index];
      if (element.user_from === userId) {
        friendRequestForHim = true;
        friendRequestForHimId = element.id;
        break;
      }
    }

    return {
      friend,
      friendRequestToMe,
      friendRequestForHim,
      friendRequestToMeId,
      friendRequestForHimId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto).catch(() => {
      throw new HttpException(
        'faild to update user',
        HttpStatus.NOT_IMPLEMENTED,
      );
    });
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
