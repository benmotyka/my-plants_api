import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { PlantService } from '@modules/plant/plant.service';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { UserService } from '@modules/user/user.service';
import { v4 as uuid } from 'uuid';

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
    it('should create one plant', async () => {
      const randomId = uuid();
      const user = await userService.findOneOrCreateByDeviceId(randomId);

      const name = 'test';
      const description = 'test';
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
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });
});
