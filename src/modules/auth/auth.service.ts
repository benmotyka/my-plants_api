import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '.prisma/client';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { ResponseType } from 'src/enums/ResponseType.enum';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { ExistingUsernameException } from './exceptions/ExistingUsername.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

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
      const passwordMatch = bcrypt.compareSync(
        plainTextPass + this.configService.get('SALT'),
        user.password,
      );

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
      throw new ExistingUsernameException();
    }

    this.logger.debug(
      `Username: ${registerRequestDto.username} seems to be unique, creating new user`,
    );
    const user = await this.userService.createUser({
      username: registerRequestDto.username,
      password: this.generateHash(registerRequestDto.password),
    });

    this.logger.debug(
      `Registering new user: ${registerRequestDto.username} was successful`,
    );
    return ResponseType.SUCCESS;
  }

  login(user: User): LoginResponseDto {
    this.logger.debug(
      `Login successful for username: ${user.username}, generating access token for username`,
    );
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }

  private generateHash(value: string): string {
    return bcrypt.hashSync(
      value + this.configService.get('SALT'),
      parseInt(this.configService.get('SALT_ROUNDS')),
    );
  }
}
