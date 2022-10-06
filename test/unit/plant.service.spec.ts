import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Plant, User } from '@prisma/client';

import { AttachmentService } from '@modules/attachment/attachment.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { RemindingService } from '@modules/reminding/reminding.service';
import { PlantService } from '@modules/plant/plant.service';

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
      deviceId: '123',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    mockPlant = {
      id: '123',
      name: 'name',
      description: 'description',
      imageSrc: null,
      color: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      watering: [],
      reminders: [],
      
    };
  });

  // // @TODO: add test
  // describe('getAllPlants', () => {});

  // describe('editPlant', () => {});
});
