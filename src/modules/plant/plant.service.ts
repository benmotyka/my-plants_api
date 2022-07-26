import { User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseType } from 'src/enums/ResponseType.enum';
import { PlantResponse } from 'src/shared/interfaces/PlantResponse.interface';
import { AttachmentService } from '../attachment/attachment.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from './dto/EditPlantRequest.dto';
@Injectable()
export class PlantService {
  constructor(
    private prisma: PrismaService,
    private attachmentService: AttachmentService,
  ) {}

  async getAllPlants(user: User): Promise<PlantResponse[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        userId: user.id,
        deleted_at: null,
      },
      include: {
        watering: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });

    return plants.map((plant) => ({
      id: plant.id,
      name: plant.name,
      description: plant.description,
      imgSrc: plant.image_src,
      createdAt: plant.created_at,
      latestWatering: plant.watering[0],
    }));
  }

  async createPlant(
    createPlantRequestDto: CreatePlantRequestDto,
    user: User,
  ): Promise<PlantResponse> {
    const plant = await this.prisma.plant.create({
      data: {
        userId: user.id,
        name: createPlantRequestDto.name,
        description: createPlantRequestDto.description,
        color: createPlantRequestDto.color,
      },
    });

    if (createPlantRequestDto.imageSrc) {
      const result = await this.attachmentService.uploadFile(
        createPlantRequestDto.imageSrc,
        plant,
      );

      await this.prisma.plant.update({
        data: {
          image_src: result.url,
        },
        where: {
          id: plant.id,
        },
      });
    }

    return {
      id: plant.id,
      name: plant.name,
      description: plant.description,
      createdAt: plant.created_at,
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
      throw new BadRequestException('plant-not-found');
    }

    const editedPlant = await this.prisma.plant.update({
      data: {
        name: editPlantRequestDto.name,
        description: editPlantRequestDto.description,
        image_src: editPlantRequestDto.imageSrc,
        color: editPlantRequestDto.color,
      },
      where: {
        id: plant.id,
      },
    });

    return {
      id: editedPlant.id,
      name: editedPlant.name,
      description: editedPlant.description,
      imgSrc: editedPlant.image_src,
      createdAt: editedPlant.created_at,
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
      throw new BadRequestException('plant-not-found');
    }

    await this.prisma.plant.update({
      data: {
        deleted_at: new Date(),
      },
      where: {
        id: id,
      },
    });

    return ResponseType.SUCCESS;
  }
}
