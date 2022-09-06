import bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '.prisma/client';

import { UserService } from '@modules/user/user.service';
import { LoginResponseDto } from '@modules/auth/dto/LoginResponse.dto';
import { RegisterRequestDto } from '@modules/auth/dto/RegisterRequest.dto';
import { ResponseType } from '@enums/ResponseType';
import { ChangePasswordRequestDto } from './dto/ChangePasswordRequest.dto';
import { Exception } from '@enums/Exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  compareUserPassword(password: string, user: User) {
    return bcrypt.compareSync(
      password + this.configService.get('SALT'),
      user.password,
    );
  }

  async changePassword(
    { oldPassword, newPassword }: ChangePasswordRequestDto,
    user: User,
  ) {
    const passwordMatch = this.compareUserPassword(oldPassword, user);
    if (!passwordMatch)
      throw new BadRequestException(Exception.INVALID_CREDENTIALS);

    await this.userService.updatePassword(this.generateHash(newPassword), user);
    return ResponseType.SUCCESS;
  }

  async validateUser(
    username: string,
    plainTextPass: string,
  ): Promise<Omit<User, 'password'>> {
    this.logger.debug(`Validating user: ${username}`);
    const user = await this.userService.findOneByUsername(username);

    if (user) {
      this.logger.debug(
        `Found user: ${username}, checking if password matches`,
      );
      const passwordMatch = this.compareUserPassword(plainTextPass, user);

      if (passwordMatch) {
        this.logger.debug(
          `Validating user: ${username} credentials was successful`,
        );
        const { password, ...result } = user;
        return result;
      }
    }
    this.logger.debug(`Validation unsuccessful for user: ${username}`);
    return null;
  }

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<ResponseType> {
    this.logger.debug(
      `Registering new user: ${registerRequestDto.username}, checking if username exists`,
    );
    const existingUsername = await this.userService.findOneByUsername(
      registerRequestDto.username,
    );

    if (existingUsername) {
      this.logger.debug(
        `Username: ${registerRequestDto.username} exists, throwing exception`,
      );
      throw new ForbiddenException(Exception.INVALID_USERNAME);
    }

    this.logger.debug(
      `Username: ${registerRequestDto.username} seems to be unique, creating new user`,
    );

    await this.userService.createUser({
      username: registerRequestDto.username,
      password: this.generateHash(registerRequestDto.password),
    });

    this.logger.debug(
      `Registering new user: ${registerRequestDto.username} was successful`,
    );
    return ResponseType.SUCCESS;
  }

  async login(user: User): Promise<LoginResponseDto> {
    this.logger.debug(
      `Login successful for username: ${user.username}, generating access token for username`,
    );

    const userSettings = await this.userService.getUserSettings(user);

    return {
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
      userSettings,
      confirmedEmail: !!user.email,
    };
  }

  private generateHash(value: string): string {
    return bcrypt.hashSync(
      value + this.configService.get('SALT'),
      parseInt(this.configService.get('SALT_ROUNDS')),
    );
  }
}
