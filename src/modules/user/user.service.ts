import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';

import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateUser } from '@modules/user/interfaces/CreateUser';
import { UpsertSettingsRequestDto } from './dto/UpsertSettings.request.dto';
import { ResponseType } from '@enums/ResponseType';

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

  async getUserSettings(user: User) {
    return await this.prisma.userSettings.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        pushNotificationsEnabled: true,
      },
    });
  }

  async upsertSettings(settings: UpsertSettingsRequestDto, deviceId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deviceId,
      },
    });

    await this.prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        pushNotificationsEnabled: settings.pushNotificationsEnabled,
      },
      create: {
        pushNotificationsEnabled: settings.pushNotificationsEnabled,
        user: {
          connectOrCreate: {
            create: {
              deviceId,
            },
            where: {
              deviceId,
            },
          },
        },
      },
    });

    return ResponseType.SUCCESS;
  }

  async updatePassword(password: string, user: User) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password,
      },
    });
  }
}
