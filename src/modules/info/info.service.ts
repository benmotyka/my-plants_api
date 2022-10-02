import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PatchNote } from './interfaces/PatchNote';

@Injectable()
export class InfoService {
  constructor(private prisma: PrismaService) {}

  async getLastPatchNotes(amount: number): Promise<PatchNote[]> {
    return await this.prisma.patchNotes.findMany({
      select: {
        patch: true,
        changes: true,
        createdAt: true,
      },
      take: amount,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
