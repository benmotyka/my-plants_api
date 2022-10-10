import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { InfoService } from '@modules/info/info.service';

describe('InfoService', () => {
  let prisma: PrismaService;
  let infoService: InfoService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    infoService = moduleRef.get<InfoService>(InfoService);
  });

  describe('getLastPatchNotes', () => {
    it('should return last patch notes', async () => {
      const changes = ['added this', 'added that'];
      const patch = '1.0';

      await prisma.patchNotes.create({
        data: {
          patch,
          changes,
        },
      });

      const result = await infoService.getLastPatchNotes(1);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].changes).toStrictEqual(changes);
      expect(result[0].patch).toBe(patch);
      expect(typeof result[0].createdAt).toBe('string');
    });
  });
});
