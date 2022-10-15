import dayjs from 'dayjs';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { WateringService } from '@modules/watering/watering.service';
import { v4 as uuid } from 'uuid';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { BadRequestException } from '@nestjs/common';
import { Exception } from '@enums/Exception';
describe('WateringService', () => {
  let prisma: PrismaService;
  let wateringService: WateringService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    wateringService = moduleRef.get<WateringService>(WateringService);
  });

  describe('waterPlant', () => {
    it('should water plant successfully', async () => {
      const deviceId = uuid();
      const plantId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
            },
          },
        },
      });

      const payload: WaterPlantRequestDto = {
        plantId,
      };
      const result = await wateringService.waterPlant(payload, deviceId);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');

      const watering = await prisma.watering.findFirst({
        where: {
          plantId,
        },
      });

      expect(watering).toBeDefined();
      expect(watering.plantId).toBe(plantId);
    });

    it('should throw invalid plant exception', async () => {
      const deviceId = uuid();
      const deviceId2 = uuid();
      const plantId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
            },
          },
        },
      });

      const payload: WaterPlantRequestDto = {
        plantId,
      };
      expect(async () => {
        await wateringService.waterPlant(payload, deviceId2);
      }).rejects.toThrow(new BadRequestException(Exception.INVALID_PLANT));
    });
  });

  describe('getAllWateringsForPlant', () => {
    it('should return waterings successfully', async () => {
      const deviceId = uuid();
      const plantId = uuid();
      const wateringId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
              waterings: {
                create: {
                  id: wateringId,
                },
              },
            },
          },
        },
      });

      const result = await wateringService.getAllWateringsForPlant(
        plantId,
        deviceId,
      );

      const day = dayjs().format('YYYY-MM-DD');

      expect(result).toBeDefined();
      expect(Object.keys(result)).toContain(day);
      expect(Object.keys(result)).toHaveLength(1);
      expect(result[day]).toHaveLength(1);
      expect(result[day][0]).toBeInstanceOf(Date);
    });

    it('should throw invalid plant exception', async () => {
      const deviceId = uuid();
      const deviceId2 = uuid();
      const plantId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
            },
          },
        },
      });
      expect(async () => {
        await wateringService.getAllWateringsForPlant(plantId, deviceId2);
      }).rejects.toThrow(new BadRequestException(Exception.INVALID_PLANT));
    });
  });

  describe('cancelWatering', () => {
    it('should cancel watering successfully', async () => {
      const deviceId = uuid();
      const plantId = uuid();
      const wateringId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
              waterings: {
                create: {
                  id: wateringId,
                },
              },
            },
          },
        },
      });

      await wateringService.cancelWatering(wateringId, deviceId);

      const watering = await prisma.watering.findFirst({
        where: {
          id: wateringId,
        },
      });

      expect(watering).toBeNull();
    });

    it('should throw invalid plant exception', async () => {
      const deviceId = uuid();
      const deviceId2 = uuid();
      const plantId = uuid();
      const wateringId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: uuid(),
              waterings: {
                create: {
                  id: wateringId,
                },
              },
            },
          },
        },
      });
      expect(async () => {
        await wateringService.cancelWatering(wateringId, deviceId2);
      }).rejects.toThrow(new BadRequestException(Exception.INVALID_PLANT));
    });
  });
});
