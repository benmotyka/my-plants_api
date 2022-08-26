import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationCodeService {
  constructor(private prisma: PrismaService) {}
}
