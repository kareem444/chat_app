import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) { }

  async hashPassword(pass: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(pass, saltOrRounds);
  }

  async checkValidatedPassword(pass: string, hash: string) {
    return await bcrypt.compare(pass, hash);
  }

  async login(
    user: User,
  ): Promise<{ message: string; access_token: String; user: User }> {
    return {
      message: 'Login Successfull',
      access_token: this.jwtService.sign({
        userId: user.id,
        email: user.email,
      }),
      user: user,
    };
  }
}
