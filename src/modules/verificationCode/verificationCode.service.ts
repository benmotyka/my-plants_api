import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SendEmailConfirmationRequestDto } from './dto/SendEmailConfirmation.request.dto';

@Injectable()
export class VerificationCodeService {
  constructor(private prisma: PrismaService) {}

  async sendEmailConfirmation(
    { email }: SendEmailConfirmationRequestDto,
    user: User,
  ) {
    const code = '123';
    console.log(email);
    //send code
    await this.prisma.verificationCodes.create({
      data: {
        code,
        type: 'EMAIL_CONFIRMATION',
        userId: user.id,
      },
    });
  }
}
