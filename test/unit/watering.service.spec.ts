import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '.prisma/client';

import { ResponseType } from '@enums/ResponseType.enum';
import { PrismaService } from '@modules/prisma/prisma.service';
import { WateringService } from '@modules/watering/watering.service';

describe('WateringService', () => {
  let wateringService: WateringService;
  let prismaService: PrismaService;
  let mockUser: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WateringService, PrismaService],
    }).compile();

    wateringService = moduleRef.get<WateringService>(WateringService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    mockUser = {
      id: '123',
      username: 'username',
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
  });

  describe('waterPlant', () => {
    it('should throw bad request exception', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce(null);

      expect(async () => {
        await wateringService.waterPlant({ plantId: 'id' }, mockUser);
      }).rejects.toThrow(BadRequestException);
    });

    it('should return success', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce('not-null');
      prismaService.watering.create = jest.fn();

      expect(
        await wateringService.waterPlant({ plantId: 'id' }, mockUser),
      ).toBe(ResponseType.SUCCESS);
    });
  });
});
