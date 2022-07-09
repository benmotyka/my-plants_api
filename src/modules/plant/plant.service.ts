import { Plant, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PlantResponse } from 'src/shared/interfaces/PlantResponse.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from './dto/EditPlantRequest.dto';

@Injectable()
export class PlantService {
  constructor(private prisma: PrismaService) {}

  async getAllPlants(user: User): Promise<PlantResponse[]> {
    const plants = await this.prisma.plant.findMany({
      where: {
        userId: user.id
      }
    })

    return plants.map(plant => ({
      id: plant.id,
      name: plant.name,
      description: plant.description,
      imgSrc: plant.image_src,
      createdAt: plant.created_at,
    }))
  }

  async createPlant(createPlantRequestDto: CreatePlantRequestDto, user: User): Promise<PlantResponse> {
    const plant = await this.prisma.plant.create({
      data: {
        userId: user.id,
        name: createPlantRequestDto.name,
        description: createPlantRequestDto.description,
        image_src: createPlantRequestDto.imageSrc,
        color: createPlantRequestDto.color,
      },
    });

    return {
      id: plant.id,
      name: plant.name,
      description: plant.description,
      imgSrc: plant.image_src,
      createdAt: plant.created_at,
    }
  }

  async editPlant(editPlantRequestDto: EditPlantRequestDto, user: User) {
    return 'a'
  }
}
