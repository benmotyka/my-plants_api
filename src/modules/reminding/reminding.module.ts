import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { RemindingService } from '@modules/reminding/reminding.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [RemindingService],
  exports: [RemindingService],
})
export class RemindingModule {}