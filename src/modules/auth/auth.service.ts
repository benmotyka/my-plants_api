import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
  ) {}

  async validateUser(
    username: string,
    plainTextPass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOneByUsername(username);

    if (user) {
      const passwordMatch = bcrypt.compareSync(plainTextPass, user.password);

      if (passwordMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
}
