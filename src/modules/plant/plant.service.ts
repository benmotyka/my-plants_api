import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { ResponseType } from '@enums/ResponseType';
import { PlantResponse } from '@shared/interfaces/PlantResponse';
import { AttachmentService } from '@modules/attachment/attachment.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import { RemindingService } from '@modules/reminding/reminding.service';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { Exception } from '@enums/Exception';
import { UserService } from '@modules/user/user.service';
import { ImportPlantRequestDto } from './dto/ImportPlantRequest.dto';
import { ImagesData } from './dto/GetPlantImagesHistory.dto';
import { UploadImageRequestDto } from './dto/UploadImageRequest.dto';
import { UtilService } from '@modules/util/util.service';

@Injectable()
export class PlantService {
  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
    private remindingService: RemindingService,
    private userService: UserService,
    private utilService: UtilService,
  ) {}

  async getAllPlants(deviceId: string): Promise<PlantResponse[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        deletedAt: null,
        users: {
          some: {
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
            user: {
              deviceId,
            },
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
    payload: CreatePlantRequestDto,
    deviceId: string,
  ): Promise<PlantResponse> {
    let imageUrl: string;
    if (payload.imageSrc) {
      imageUrl = await this.attachmentService.uploadFile(payload.imageSrc);
    }

    const shareId = this.utilService.generateUserFriendlyId();

    const user = await this.userService.findOneOrCreateByDeviceId(deviceId);

    const plant = await this.prisma.plant.create({
      data: {
        name: payload.name,
        description: payload.description,
        imageSrc: imageUrl,
        shareId,
        color: payload.color,
        users: {
          connect: {
            deviceId,
          },
        },
      },
    });

    if (imageUrl) {
      await this.attachmentService.createAttachment({
        plantId: plant.id,
        userId: user.id,
        url: imageUrl,
        attachmentType: 'plant_picture',
      });
    }

    if (payload.wateringReminderFrequency) {
      await this.remindingService.createReminder({
        userId: user.id,
        plantId: plant.id,
        frequencyDays: payload.wateringReminderFrequency,
        type: 'plant_watering',
      });
    }

    return {
      id: plant.id,
      name: plant.name,
      shareId: plant.shareId,
      description: plant.description,
      createdAt: plant.createdAt,
    };
  }

  async importPlant(
    payload: ImportPlantRequestDto,
    deviceId: string,
  ): Promise<PlantResponse> {
    const plant = await this.prisma.plant.findUnique({
      where: {
        shareId: payload.shareId,
      },
    });

    const user = await this.userService.findOneOrCreateByDeviceId(deviceId);

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
    }

    if (user.plants.map((plant) => plant.id).includes(plant.id)) {
      throw new BadRequestException(Exception.PLANT_ALREADY_ADDED);
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        plants: {
          connect: {
            id: plant.id,
          },
        },
      },
    });

    return {
      id: plant.id,
      name: plant.name,
      shareId: plant.shareId,
      description: plant.description,
      createdAt: plant.createdAt,
    };
  }

  async uploadImage(
    payload: UploadImageRequestDto,
    deviceId: string,
  ): Promise<ResponseType> {
    const user = await this.userService.findOneOrCreateByDeviceId(deviceId);

    const imageUrl = await this.attachmentService.uploadFile(payload.image);

    await this.attachmentService.createAttachment({
      plantId: payload.plantId,
      userId: user.id,
      attachmentType: 'plant_picture',
      url: imageUrl,
    });

    return ResponseType.SUCCESS;
  }

  async editPlant(
    payload: EditPlantRequestDto,
    deviceId: string,
  ): Promise<PlantResponse> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: payload.id,
        users: {
          some: {
            deviceId,
          },
        },
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
    }

    let imageUrl: string;
    if (payload.imageSrc) {
      imageUrl = await this.attachmentService.uploadFile(payload.imageSrc);
    }

    const editedPlant = await this.prisma.plant.update({
      data: {
        name: payload.name,
        description: payload.description,
        imageSrc: imageUrl,
        color: payload.color,
      },
      where: {
        id: plant.id,
      },
    });

    const user = await this.userService.findOneOrCreateByDeviceId(deviceId);

    if (imageUrl) {
      await this.attachmentService.createAttachment({
        plantId: plant.id,
        userId: user.id,
        attachmentType: 'plant_picture',
        url: imageUrl,
      });
    }

    if (payload.wateringReminderFrequency) {
      await this.remindingService.upsertReminderForPlant({
        plantId: plant.id,
        userId: user.id,
        frequencyDays: payload.wateringReminderFrequency,
        type: 'plant_watering',
      });
    } else {
      await this.remindingService.deleteRemindersForPlant({
        plantId: plant.id,
        deviceId: user.deviceId,
      });
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

  async getPlantImagesHistory(
    plantId: string,
    deviceId: string,
  ): Promise<ImagesData> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: plantId,
        users: {
          some: {
            deviceId,
          },
        },
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
    }

    const attachments = await this.attachmentService.getAttachmentsByPlantId(
      plant.id,
    );

    let response: ImagesData = {};
    attachments.forEach((attachment) => {
      const day = dayjs(attachment.createdAt).format('YYYY-MM-DD');
      if (!response[day]) {
        response = {
          ...response,
          [day]: [],
        };
      }
      response[day].push(attachment.url);
    });

    return response;
  }
}
