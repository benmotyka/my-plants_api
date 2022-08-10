import { Request } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ResponseType } from '../../enums/ResponseType.enum';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllWateringsForPlantResponseDto } from './dto/GetAllWateringsForPlantResponse.dto';
import { WaterPlantResponseDto } from './dto/WaterPlantResponse.dto';
import { WateringController } from './watering.controller';
import { WateringService } from './watering.service';

describe('CatsController', () => {
  let wateringController: WateringController;
  let wateringService: WateringService;

  const req = {
    user: {
      username: 'username',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WateringController],
      providers: [WateringService, PrismaService],
    }).compile();

    wateringService = moduleRef.get<WateringService>(WateringService);
    wateringController = moduleRef.get<WateringController>(WateringController);
  });

  describe('getAllWateringsForPlant', () => {
    it('should return waterings', async () => {
      const result = {
        key: [new Date()],
      };

      jest
        .spyOn(wateringService, 'getAllWateringsForPlant')
        .mockImplementation(async () => result);

      expect(
        await wateringController.getAllWateringsForPlant('plantId', req),
      ).toStrictEqual(new GetAllWateringsForPlantResponseDto(result));
    });
  });

  describe('waterPlant', () => {
    it('should return success status', async () => {
      const result = ResponseType.SUCCESS;
      jest
        .spyOn(wateringService, 'waterPlant')
        .mockImplementation(async () => result);

      expect(
        await wateringController.waterPlant({ plantId: 'plantId' }, req),
      ).toStrictEqual(new WaterPlantResponseDto(result));
    });
  });
});
