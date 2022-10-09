import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@modules/prisma/prisma.service';
import { UserService } from '@modules/user/user.service';
import { v4 as uuid } from 'uuid';

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
    it('should create one user', async () => {
      const randomId = uuid();
      const result = await userService.findOneOrCreateByDeviceId(randomId);

      expect(result).toBeDefined();
      expect(result.deviceId).toBe(randomId);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.deletedAt).toBeNull();
      expect(result.plants).toHaveLength(0);
      expect(result.attachments).toHaveLength(0);
      expect(result.userSettings).toBeNull();
      expect(typeof result.id).toBe('string');
    });
  });
});
