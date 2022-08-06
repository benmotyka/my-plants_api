import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Plant, Reminder } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDetails } from './interfaces/createReminderDetails';

@Injectable()
export class RemindingService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RemindingService.name);

  @Cron('*/30 * * * * *')
  sendReminders() {
    this.logger.debug('Send reminders');
  }

  async createReminder(
    details: CreateReminderDetails,
    plant: Plant,
  ): Promise<Reminder> {
    return await this.prisma.reminder.create({
      data: {
        plantId: plant.id,
        frequencyDays: details.frequencyDays,
        reminder_type: details.type,
      },
    });
  }
}
