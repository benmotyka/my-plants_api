import { ResponseType } from '@enums/ResponseType';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SendEmailConfirmationRequestDto } from './dto/SendEmailConfirmation.request.dto';

@Injectable()
export class VerificationCodeService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  // @TODO: add language
  async sendEmailConfirmation(
    { email }: SendEmailConfirmationRequestDto,
    user: User,
  ) {
    const code = this.generateCode();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your email',
      html: `Verification code: ${code}`,
    });

    await this.prisma.verificationCodes.create({
      data: {
        code,
        type: 'EMAIL_CONFIRMATION',
        userId: user.id,
      },
    });

    return ResponseType.SUCCESS;
  }

  private generateCode() {
    return `${Math.floor(10000 + Math.random() * 90000)}`;
  }
}
