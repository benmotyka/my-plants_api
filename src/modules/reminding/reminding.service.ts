import * as dayjs from 'dayjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Plant } from '@prisma/client';

import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateReminderDetails } from '@modules/reminding/interfaces/createReminderDetails';

@Injectable()
export class RemindingService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RemindingService.name);

  @Cron('*/10 * * * * *')
  async sendReminders() {
    const reminders = await this.getAllUnsentRemindersDetails();
    for (const reminder of reminders) {
      if (reminder.plant.watering.length) {
        const now = dayjs();
        const lastWatering = dayjs(reminder.plant.watering[0].created_at);

        if (reminder.frequencyDays >= now.diff(lastWatering, 'day')) {
          this.logger.debug('Sending reminder for plant:');
          await this.changeReminderNotifiedStatus(reminder.id, true);
        }
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
            watering: {
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });
  }

  async createReminder(details: CreateReminderDetails, plant: Plant) {
    return await this.prisma.reminder.create({
      data: {
        plantId: plant.id,
        frequencyDays: details.frequencyDays,
        reminder_type: details.type,
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

  async upsertReminderForPlant(details: CreateReminderDetails, plant: Plant) {
    return await this.prisma.reminder.upsert({
      where: {
        plantId: plant.id,
      },
      update: {
        frequencyDays: details.frequencyDays,
        reminder_type: details.type,
      },
      create: {
        plantId: plant.id,
        frequencyDays: details.frequencyDays,
        reminder_type: details.type,
      },
    });
  }

  async deleteRemindersForPlant(plant: Plant) {
    return await this.prisma.reminder.deleteMany({
      where: {
        plantId: plant.id,
      },
    });
  }
}
