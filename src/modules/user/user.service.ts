import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import * as bcrypt from 'bcrypt';
import { ExistingUsernameException } from './exception/ExistingUsername.exception';
import { ResponseType } from 'src/enums/ResponseType.enum';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: {
        username
      }
    })
  }

  async register(registerRequestDto: RegisterRequestDto): Promise<ResponseType> {
    const existingUsername = await this.prisma.user.findFirst({
      where: {
        username: registerRequestDto.username
      }
    })

    if (existingUsername) {
      throw new ExistingUsernameException()
    }

    const user = await this.prisma.user.create({
      data: {
        username: registerRequestDto.username,
        password: this.generateHash(registerRequestDto.password),
      },
    });

    // @TODO: add logger
    console.log(`Registered user: ${user.username}`)

    return ResponseType.SUCCESS
  }

  private generateHash(value: string): string {
    // @TODO: add env salt
    return bcrypt.hashSync(value, 2);

  }
}
