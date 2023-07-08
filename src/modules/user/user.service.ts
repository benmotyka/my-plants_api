import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@modules/prisma/prisma.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';
import { AddBugReportRequestDto } from './dto/AddBugReportRequest.dto';
import { Exception } from '@enums/Exception';
import { UpdateUserInfoRequestDto } from './dto/UpdateUserInfoRequest.dto';

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
  }

  async updateUserInfo(payload: UpdateUserInfoRequestDto, deviceId: string) {
    await this.prisma.user.upsert({
      create: {
        deviceId,
        ...payload,
      },
      update: {
        ...payload,
      },
      where: {
        deviceId,
      },
    });
  }

  async updateUserLanguage(deviceId: string, deviceLanguage: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        deviceId,
      },
    });

    if (user) {
      await this.prisma.user.update({
        where: {
          deviceId,
        },
        data: {
          deviceLanguage,
        },
      });
    }
  }

  async addBugReport(bugReport: AddBugReportRequestDto, deviceId: string) {
    const BUG_REPORTS_THRESHOLD = 5;

    const bugReports = await this.prisma.bugReport.findMany({
      where: {
        user: {
          deviceId,
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 60 * 60 * 1000),
        },
      },
    });

    if (bugReports.length >= BUG_REPORTS_THRESHOLD) {
      throw new BadRequestException(Exception.TOO_MANY_BUG_REPORTS);
    }

    await this.prisma.bugReport.create({
      data: {
        description: bugReport.description,
        email: bugReport.email,
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
}
