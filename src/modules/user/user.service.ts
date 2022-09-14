import { Injectable } from '@nestjs/common';

import { PrismaService } from '@modules/prisma/prisma.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettings.request.dto';
import { ResponseType } from '@enums/ResponseType';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async upsertSettings(settings: UpsertSettingsRequestDto, deviceId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deviceId,
      },
    });

    if (user) {
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
            create: {
              deviceId,
            },
          },
        },
      });
    }

    return ResponseType.SUCCESS;
  }
}
