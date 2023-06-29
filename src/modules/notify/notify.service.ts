import { INestApplication, Injectable } from '@nestjs/common';

@Injectable()
export class NotifyService {
    constructor(private prisma: PrismaService) {}
    private readonly logger = new Logger(NotifyService.name);
  
  async pushNotifyUser({ userId, header, title }: { userId: string; header: string; title: string; g}) {
    this.logger.debug(`Sending push notification for userId: ${userId}`)
  }
}
