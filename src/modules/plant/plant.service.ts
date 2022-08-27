import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '.prisma/client';

import { ResponseType } from '@enums/ResponseType';
import { PlantResponse } from '@shared/interfaces/PlantResponse';
import { AttachmentService } from '@modules/attachment/attachment.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { RemindingService } from '@modules/reminding/reminding.service';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { Exception } from '@enums/Exception';

@Injectable()
export class PlantService {
  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
    private remindingService: RemindingService,
  ) {}

  async getAllPlants(user: User): Promise<PlantResponse[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        userId: user.id,
        deletedAt: null,
      },
      include: {
        watering: {
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
      createdAt: plant.createdAt,
      latestWatering: plant.watering[0],
      ...(plant.reminders.length && {
        wateringReminderFrequency: plant.reminders[0].frequencyDays,
      }),
    }));
  }

  async createPlant(
    createPlantRequestDto: CreatePlantRequestDto,
    user: User,
  ): Promise<PlantResponse> {
    let imageUrl: string;
    if (createPlantRequestDto.imageSrc) {
      imageUrl = await this.attachmentService.uploadFile(
        createPlantRequestDto.imageSrc,
      );
    }

    const plant = await this.prisma.plant.create({
      data: {
        userId: user.id,
        name: createPlantRequestDto.name,
        description: createPlantRequestDto.description,
        imageSrc: imageUrl,
        color: createPlantRequestDto.color,
      },
    });

    if (imageUrl) {
      await this.attachmentService.createAttachment(
        plant,
        imageUrl,
        'plant_picture',
      );
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
      description: plant.description,
      createdAt: plant.createdAt,
    };
  }

  async editPlant(
    editPlantRequestDto: EditPlantRequestDto,
    user: User,
  ): Promise<PlantResponse> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: editPlantRequestDto.id,
        userId: user.id,
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

    if (imageUrl) {
      await this.attachmentService.createAttachment(
        plant,
        imageUrl,
        'plant_picture',
      );
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
      createdAt: editedPlant.createdAt,
    };
  }

  async deletePlant(id: string, user: User): Promise<ResponseType> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
    }

    await this.prisma.plant.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
    });

    return ResponseType.SUCCESS;
  }
}
