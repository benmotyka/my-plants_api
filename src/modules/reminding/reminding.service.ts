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

  // @Cron('*/10 * * * * *')
  async sendReminders() {
    const reminders = await this.getAllUnsentRemindersDetails();
    const messagesToBeSent = [];

    for (const reminder of reminders) {
      if (!reminder.plant.waterings.length) {
        continue;
      }
  
      const now = dayjs();
      const lastWatering = dayjs(reminder.plant.waterings[0].createdAt);

      this.logger.debug(`Checking reminder ${reminder.id} for ${reminder.plant.name}. Last watering was ${lastWatering.format('YYYY-MM-DD')} and reminder frequency is ${reminder.frequencyDays} days. Now is: ${now.format('YYYY-MM-DD')} so the if result will be ${reminder.frequencyDays <= now.diff(lastWatering, 'day')} because now.diff is ${now.diff(lastWatering, 'day')}`);

      if (reminder.frequencyDays <= now.diff(lastWatering, 'day')) {

        for (const user of reminder.plant.users) {
          this.logger.debug(`Adding user: ${user.id} to message list`);
          messagesToBeSent.push({
            to: user.deviceId,
            body: `It's time to water ${reminder.plant.name}!`,
          });
        }
      }
    }

    this.logger.debug(`Sending ${messagesToBeSent.length} messages`);
    this.logger.debug(`Messages: ${JSON.stringify(messagesToBeSent)}`);

    // Sending messages

    // Updating status to all reminders so they won't be sent again
    // Put this somewhere, maybe in loop, or create another function
    // this.logger.debug(`Changing reminder status for ${reminder.id}`);
    // await this.changeReminderNotifiedStatus(reminder.id, true);
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
