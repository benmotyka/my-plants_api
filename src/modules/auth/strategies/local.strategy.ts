import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AuthService } from '@modules/auth/auth.service';
import { User } from '.prisma/client';
import { Exception } from '@enums/Exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: Exception.INVALID_CREDENTIALS,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
