import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindingService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(RemindingService.name);

  @Cron('*/30 * * * * *')
  sendReminders() {
    this.logger.debug('Send reminders');
  }
}
