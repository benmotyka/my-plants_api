import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as dayjs from 'dayjs';
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
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  });

  describe('waterPlant', () => {
    it('should throw bad request exception', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce(null);

      expect(async () => {
        await wateringService.waterPlant({ plantId: 'id' }, mockUser);
      }).rejects.toThrow(BadRequestException);

      expect(prismaService.plant.findFirst).toBeCalled();
    });

    it('should return success', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce('not-null');
      prismaService.watering.create = jest.fn();

      expect(
        await wateringService.waterPlant({ plantId: 'id' }, mockUser),
      ).toBe(ResponseType.SUCCESS);

      expect(prismaService.plant.findFirst).toBeCalled();
      expect(prismaService.watering.create).toBeCalled();
    });
  });

  describe('getAllWateringsForPlant', () => {
    it('should throw bad request exception', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce(null);

      expect(async () => {
        await wateringService.getAllWateringsForPlant('id', mockUser);
      }).rejects.toThrow(BadRequestException);

      expect(prismaService.plant.findFirst).toBeCalled();
    });

    it('should return no waterings (empty object)', async () => {
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce('not-null');
      prismaService.watering.findMany = jest.fn().mockReturnValueOnce([]);

      expect(
        await wateringService.getAllWateringsForPlant('id', mockUser),
      ).toStrictEqual({});

      expect(prismaService.plant.findFirst).toBeCalled();
      expect(prismaService.watering.findMany).toBeCalled();
    });

    it('should return waterings', async () => {
      const date = new Date();
      prismaService.plant.findFirst = jest.fn().mockReturnValueOnce('not-null');
      prismaService.watering.findMany = jest.fn().mockReturnValueOnce([
        {
          createdAt: date,
        },
      ]);

      expect(
        await wateringService.getAllWateringsForPlant('id', mockUser),
      ).toStrictEqual({
        [dayjs(date).format('YYYY-MM-DD')]: [date],
      });

      expect(prismaService.plant.findFirst).toBeCalled();
      expect(prismaService.watering.findMany).toBeCalled();
    });
  });
});
