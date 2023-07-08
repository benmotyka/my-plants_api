import dayjs from 'dayjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '@modules/prisma/prisma.service';
import { NotifyService } from '@modules/notify/notify.service'
import { CreateReminderDetails } from '@modules/reminding/interfaces/createReminderDetails';

@Injectable()
export class RemindingService {
  constructor(
    private prisma: PrismaService,
    private notifyService: NotifyService
    ) {}
  private readonly logger = new Logger(RemindingService.name);

  @Cron('*/10 * * * * *')
  async sendReminders() {
    const reminders = await this.getAllUnsentRemindersDetails();

    for (const reminder of reminders) {
      if (!reminder.plant.waterings.length) {
        continue;
      }
  
      const now = dayjs();
      const lastWatering = dayjs(reminder.plant.waterings[0].createdAt);

      if (reminder.frequencyDays >= now.diff(lastWatering, 'day')) {
        const messages = [];

        for (const user of reminder.plant.users) {
          this.logger.debug(`Adding user: ${user.id} to message list`);
          messages.push({
            to: user.deviceId,
            body: `It's time to water ${reminder.plant.name}!`,
          });
        }
        await this.changeReminderNotifiedStatus(reminder.id, true);
      }
    }
  }

  async getAllUnsentRemindersDetails() {
    return await this.prisma.reminder.findMany({
      where: {
        notified: false,
      },
      include: {
        plant: {
          include: {
            waterings: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
            users: true,
          },
        },
      },
    });
  }

  async createReminder({
    userId,
    plantId,
    frequencyDays,
    type,
  }: CreateReminderDetails) {
    return await this.prisma.reminder.create({
      data: {
        plantId,
        userId,
        frequencyDays: frequencyDays,
        reminderType: type,
      },
    });
  }

  async changeReminderNotifiedStatus(reminderId: string, status: boolean) {
    return await this.prisma.reminder.update({
      where: {
        id: reminderId,
      },
      data: {
        notified: status,
      },
    });
  }

  async upsertReminderForPlant({
    userId,
    plantId,
    frequencyDays,
    type,
  }: CreateReminderDetails) {
    const previousReminder = await this.prisma.reminder.findFirst({
      where: {
        plantId,
        userId,
      },
    });

    if (previousReminder) {
      return await this.prisma.reminder.update({
        where: {
          id: previousReminder.id,
        },
        data: {
          frequencyDays,
        },
      });
    }
    return await this.prisma.reminder.create({
      data: {
        plantId,
        userId,
        frequencyDays: frequencyDays,
        reminderType: type,
      },
    });
  }

  async deleteRemindersForPlant({
    plantId,
    deviceId,
  }: {
    plantId: string;
    deviceId: string;
  }) {
    return await this.prisma.reminder.deleteMany({
      where: {
        plantId,
        user: {
          deviceId,
        },
      },
    });
  }
}
