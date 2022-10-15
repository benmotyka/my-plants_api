import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { PlantService } from '@modules/plant/plant.service';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { UserService } from '@modules/user/user.service';
import { v4 as uuid } from 'uuid';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { BadRequestException } from '@nestjs/common';
import { Exception } from '@enums/Exception';

describe('PlantService', () => {
  let prisma: PrismaService;
  let plantService: PlantService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    plantService = moduleRef.get<PlantService>(PlantService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('createPlant', () => {
    it('should create plant successfully', async () => {
      const randomId = uuid();
      const user = await userService.findOneOrCreateByDeviceId(randomId);

      const name = 'name';
      const description = 'description';
      const payload: CreatePlantRequestDto = {
        name,
        description,
      };
      const result = await plantService.createPlant(payload, user.deviceId);

      expect(result).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.name).toBe(name);
      expect(typeof result.shareId).toBe('string');
      expect(result.shareId).toHaveLength(6);
      expect(result.description).toBe(description);
    });
  });

  describe('editPlant', () => {
    it('should edit plant successfully', async () => {
      const randomId = uuid();
      const user = await userService.findOneOrCreateByDeviceId(randomId);

      const createdPlant = await plantService.createPlant(
        {
          name: 'name',
          description: 'description',
        },
        user.deviceId,
      );
      const name = 'newName';
      const description = 'newDescription';
      const payload: EditPlantRequestDto = {
        id: createdPlant.id,
        name,
        description,
      };
      const result = await plantService.editPlant(payload, user.deviceId);

      expect(result).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.name).toBe(name);
      expect(typeof result.shareId).toBe('string');
      expect(result.shareId).toBe(createdPlant.shareId);
      expect(result.description).toBe(description);
    });

    it('should throw invalid plant exception', async () => {
      const randomId = uuid();
      const user = await userService.findOneOrCreateByDeviceId(randomId);

      const payload: EditPlantRequestDto = {
        id: 'random-id',
        name: 'newName',
      };

      expect(async () => {
        await plantService.editPlant(payload, user.deviceId);
      }).rejects.toThrow(new BadRequestException(Exception.INVALID_PLANT));
    });
  });
});
