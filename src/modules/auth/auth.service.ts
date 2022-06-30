import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { ResponseType } from 'src/enums/ResponseType.enum';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { ExistingUsernameException } from './exceptions/ExistingUsername.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

  async register(registerRequestDto: RegisterRequestDto): Promise<ResponseType> {
    const existingUsername = await this.userService.findOneByUsername(registerRequestDto.username)

    if (existingUsername) {
      throw new ExistingUsernameException()
    }

    const user = await this.userService.createUser({username: registerRequestDto.username, password: this.generateHash(registerRequestDto.password)})

    return ResponseType.SUCCESS
  }

  async login(user: User): Promise<LoginResponseDto> {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  private generateHash(value: string): string {
    // @TODO: add env salt
    return bcrypt.hashSync(value, 2);

  }

  private async generateTokens({userId, username}: {userId: string, username: string}): Promise<{accessToken: string, refreshToken: string}> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: 60 * 60 * 7,
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    };
  }
}
