import dayjs from 'dayjs';

import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PatchNote } from './interfaces/PatchNote';

@Injectable()
export class InfoService {
  constructor(private prisma: PrismaService) {}

  async getLastPatchNotes({
    amount,
    language,
  }: {
    amount: number;
    language: string;
  }): Promise<PatchNote[]> {
    const patchNotes = await this.prisma.patchNotes.findMany({
      take: amount,
      where: {
        language,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return patchNotes.map(({ changes, patch, createdAt }) => ({
      changes,
      patch,
      createdAt: dayjs(createdAt).format('YYYY-MM-DD'),
    }));
  }
}
