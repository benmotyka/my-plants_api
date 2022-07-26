import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AttachmentService, ConfigService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
