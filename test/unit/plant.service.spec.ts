import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Plant, User } from '@prisma/client';

import { AttachmentService } from '../../src/modules/attachment/attachment.service';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { RemindingService } from '../../src/modules/reminding/reminding.service';
import { PlantService } from '../../src/modules/plant/plant.service';

describe('PlantService', () => {
  let plantService: PlantService;
  let attachmentService: AttachmentService;
  let prismaService: PrismaService;
  let remindingService: RemindingService;
  let mockUser: User;
  let mockPlant: Plant & { watering: string[]; reminders: unknown[] };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AttachmentService,
        PrismaService,
        RemindingService,
        ConfigService,
        PlantService,
      ],
    }).compile();

    attachmentService = moduleRef.get<AttachmentService>(AttachmentService);
    plantService = moduleRef.get<PlantService>(PlantService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    remindingService = moduleRef.get<RemindingService>(RemindingService);

    mockUser = {
      id: '123',
      username: 'username',
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    mockPlant = {
      id: '123',
      name: 'name',
      description: 'description',
      userId: mockUser.id,
      image_src: null,
      color: null,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      watering: [],
      reminders: [],
    };
  });

  // // @TODO: add test
  // describe('getAllPlants', () => {});

  // describe('editPlant', () => {});
});
