import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '.prisma/client';

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
