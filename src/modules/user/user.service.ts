import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';

import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateUser } from '@modules/user/interfaces/CreateUser';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
  }

  async createUser({ username, password }: CreateUser) {
    return await this.prisma.user.create({
      data: {
        username,
        password,
      },
    });
  }

  async upsertSettings(settings: UpsertSettingsRequestDto) {

  }
}
