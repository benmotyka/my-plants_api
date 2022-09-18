import { BadRequestException, Injectable } from '@nestjs/common';

import { ResponseType } from '@enums/ResponseType';
import { PlantResponse } from '@shared/interfaces/PlantResponse';
import { AttachmentService } from '@modules/attachment/attachment.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { RemindingService } from '@modules/reminding/reminding.service';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { Exception } from '@enums/Exception';
import { generateUserFriendlyId } from '@util/id';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class PlantService {
  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
    private remindingService: RemindingService,
    private userService: UserService,
  ) {}

  async getAllPlants(deviceId: string): Promise<PlantResponse[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        deletedAt: null,
        users: {
          every: {
            deviceId,
          },
        },
      },
      include: {
        waterings: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        reminders: {
          select: {
            frequencyDays: true,
          },
          where: {
            reminderType: 'plant_watering',
          },
          take: 1,
        },
      },
    });

    return plants.map((plant) => ({
      id: plant.id,
      name: plant.name,
      description: plant.description,
      imgSrc: plant.imageSrc,
      shareId: plant.shareId,
      createdAt: plant.createdAt,
      latestWatering: plant.waterings[0],
      ...(plant.reminders.length && {
        wateringReminderFrequency: plant.reminders[0].frequencyDays,
      }),
    }));
  }

  async createPlant(
    createPlantRequestDto: CreatePlantRequestDto,
    deviceId: string,
  ): Promise<PlantResponse> {
    let imageUrl: string;
    if (createPlantRequestDto.imageSrc) {
      imageUrl = await this.attachmentService.uploadFile(
        createPlantRequestDto.imageSrc,
      );
    }

    const shareId = generateUserFriendlyId();

    const plant = await this.prisma.plant.create({
      data: {
        name: createPlantRequestDto.name,
        description: createPlantRequestDto.description,
        imageSrc: imageUrl,
        shareId,
        color: createPlantRequestDto.color,
        users: {
          connectOrCreate: {
            create: {
              deviceId,
            },
            where: {
              deviceId,
            },
          },
        },
      },
    });

    const user = await this.userService.findOneByDeviceId(deviceId);

    if (imageUrl) {
      await this.attachmentService.createAttachment({
        plantId: plant.id,
        userId: user.id,
        url: imageUrl,
        attachmentType: 'plant_picture',
      });
    }

    if (createPlantRequestDto.wateringReminderFrequency) {
      await this.remindingService.createReminder(
        {
          frequencyDays: createPlantRequestDto.wateringReminderFrequency,
          type: 'plant_watering',
        },
        plant,
      );
    }

    return {
      id: plant.id,
      name: plant.name,
      shareId: plant.shareId,
      description: plant.description,
      createdAt: plant.createdAt,
    };
  }

  async editPlant(
    editPlantRequestDto: EditPlantRequestDto,
    deviceId: string,
  ): Promise<PlantResponse> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: editPlantRequestDto.id,
        users: {
          every: {
            deviceId,
          },
        },
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
    }

    let imageUrl: string;
    if (editPlantRequestDto.imageSrc) {
      imageUrl = await this.attachmentService.uploadFile(
        editPlantRequestDto.imageSrc,
      );
    }

    const editedPlant = await this.prisma.plant.update({
      data: {
        name: editPlantRequestDto.name,
        description: editPlantRequestDto.description,
        imageSrc: imageUrl,
        color: editPlantRequestDto.color,
      },
      where: {
        id: plant.id,
      },
    });

    const user = await this.userService.findOneByDeviceId(deviceId);

    if (imageUrl) {
      await this.attachmentService.createAttachment({
        plantId: plant.id,
        userId: user.id,
        attachmentType: 'plant_picture',
        url: imageUrl,
      });
    }

    if (editPlantRequestDto.wateringReminderFrequency) {
      await this.remindingService.upsertReminderForPlant(
        {
          frequencyDays: editPlantRequestDto.wateringReminderFrequency,
          type: 'plant_watering',
        },
        plant,
      );
    } else {
      await this.remindingService.deleteRemindersForPlant(plant);
    }

    return {
      id: editedPlant.id,
      name: editedPlant.name,
      description: editedPlant.description,
      imgSrc: editedPlant.imageSrc,
      shareId: editedPlant.shareId,
      createdAt: editedPlant.createdAt,
    };
  }

  async deletePlant(id: string, deviceId: string): Promise<ResponseType> {
    await this.userService.removePlantFromUserCollection(id, deviceId);

    return ResponseType.SUCCESS;
  }
}
