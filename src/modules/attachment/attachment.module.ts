import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AttachmentService } from '@modules/attachment/attachment.service';

@Module({
  imports: [ConfigModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
