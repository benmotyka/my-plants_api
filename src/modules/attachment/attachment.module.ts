import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
