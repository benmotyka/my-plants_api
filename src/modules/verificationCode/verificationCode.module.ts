import { Module } from '@nestjs/common';
import { VerificationCodeController } from './verificationCode.controller';
import { VerificationCodeService } from './verificationCode.service';

@Module({
  controllers: [VerificationCodeController],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
