import { Module } from '@nestjs/common';

import { NotifyService } from '@modules/notify/notify.service';

@Module({
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
