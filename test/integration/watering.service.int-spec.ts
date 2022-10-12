import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { WateringService } from '@modules/watering/watering.service';
import { v4 as uuid } from 'uuid';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { ResponseType } from '@enums/ResponseType';
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
      expect(result).toBe(ResponseType.SUCCESS);

      const watering = await prisma.watering.findFirst({
        where: {
          plantId,
        },
      });

      expect(watering).toBeDefined();
      expect(watering.plantId).toBe(plantId);
      expect(watering.createdAt).toBeInstanceOf(Date);
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
});
