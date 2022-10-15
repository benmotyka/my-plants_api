import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { UserService } from '@modules/user/user.service';
import { v4 as uuid } from 'uuid';
import { UpsertSettingsRequestDto } from '@modules/user/dto/UpsertSettingsequest.dto';

describe('UserService', () => {
  let prisma: PrismaService;
  let userService: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('findOneOrCreateByDeviceId', () => {
    it('should create one user successfully', async () => {
      const randomId = uuid();
      const result = await userService.findOneOrCreateByDeviceId(randomId);

      expect(result).toBeDefined();
      expect(result.deviceId).toBe(randomId);
      expect(result.deletedAt).toBeNull();
      expect(result.plants).toHaveLength(0);
      expect(result.attachments).toHaveLength(0);
      expect(result.userSettings).toBeNull();
      expect(typeof result.id).toBe('string');
    });
  });

  describe('upsertSettings', () => {
    it('should upsert settings successfully', async () => {
      const randomId = uuid();
      const settings: UpsertSettingsRequestDto = {
        pushNotificationsEnabled: true,
      };
      const result = await userService.upsertSettings(settings, randomId);
      expect(result).toBeDefined();
      expect(result).toBe('success');

      const user = await userService.findOneOrCreateByDeviceId(randomId);
      expect(user).toBeDefined();
      expect(user.userSettings.pushNotificationsEnabled).toBe(true);
    });
  });

  describe('removePlantFromUserCollection', () => {
    it('should remove plant from user collection successfully', async () => {
      const deviceId = uuid();
      const plantId = uuid();

      await prisma.user.create({
        data: {
          deviceId,
          plants: {
            create: {
              id: plantId,
              name: 'test',
              shareId: 'test',
            },
          },
        },
      });

      await userService.removePlantFromUserCollection(plantId, deviceId);

      const userPlants = await prisma.user.findFirst({
        where: {
          deviceId,
        },
        include: {
          plants: true,
        },
      });

      expect(userPlants.plants.length).toBe(0);
    });
  });
});
