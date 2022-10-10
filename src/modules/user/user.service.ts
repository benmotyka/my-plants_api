import { Injectable } from '@nestjs/common';

import { PrismaService } from '@modules/prisma/prisma.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsequest.dto';
import { ResponseType } from '@enums/ResponseType';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneOrCreateByDeviceId(deviceId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deviceId,
      },
      include: {
        plants: true,
        attachments: true,
        userSettings: true,
      },
    });

    if (!user)
      return await this.prisma.user.create({
        data: {
          deviceId,
        },
        include: {
          plants: true,
          attachments: true,
          userSettings: true,
        },
      });

    return user;
  }

  async removePlantFromUserCollection(plantId: string, deviceId: string) {
    await this.prisma.user.update({
      where: {
        deviceId,
      },
      data: {
        plants: {
          disconnect: {
            id: plantId,
          },
        },
      },
    });
  }

  async upsertSettings(settings: UpsertSettingsRequestDto, deviceId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deviceId,
      },
      include: {
        userSettings: true,
      },
    });

    if (user && user.userSettings) {
      await this.prisma.userSettings.update({
        where: {
          userId: user.id,
        },
        data: {
          pushNotificationsEnabled: settings.pushNotificationsEnabled,
        },
      });
    } else {
      await this.prisma.userSettings.create({
        data: {
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
    }

    return ResponseType.SUCCESS;
  }
}
