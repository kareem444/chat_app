import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  ) { }

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
      const isMatch = this.authService.checkValidatedPassword(
        loginUserDto.password,
        user[0].password.toString(),
      );
      if (isMatch) {
        return this.authService.login(user[0]);
      } else {
        throw new HttpException('Login Faild', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('This Email Is Not Exist', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['friends'] });
  }

  async findByEmailOrName(emailOrName: string): Promise<any> {
    return await this.userRepository.find({
      where: [
        { name: Like(`%${emailOrName}%`) },
        { email: Like(`%${emailOrName}%`) },
      ],
      take: 10,
    });
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userRepository.find({ where: { email: email } });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
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
