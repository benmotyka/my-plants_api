import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotifyModule } from '@modules/notify/notify.module'
import { RemindingService } from '@modules/reminding/reminding.service';

@Module({
  imports: [ScheduleModule.forRoot(), NotifyModule],
  providers: [RemindingService],
  exports: [RemindingService],
})
export class RemindingModule {}
