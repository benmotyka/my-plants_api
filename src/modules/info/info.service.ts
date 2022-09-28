import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetLastPatchNotesResponseDto } from './dto/GetLastPatchNotesResponse.dto';

@Injectable()
export class InfoService {
  constructor(private prisma: PrismaService) {}

  async getLastPatchNotes(
    amount: number,
  ): Promise<GetLastPatchNotesResponseDto> {
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
