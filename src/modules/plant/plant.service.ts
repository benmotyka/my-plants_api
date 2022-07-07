import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from './dto/EditPlantRequest.dto';

@Injectable()
export class PlantService {
  constructor(private prisma: PrismaService) {}

  getAllPlants(user: User) {
    return this.prisma.plant.findMany({
      where: {
        userId: user.id
      }
    })
  }

  createPlant(createPlantRequestDto: CreatePlantRequestDto, user: User) {
    return this.prisma.plant.create({
      data: {
        userId: user.id,
        name: createPlantRequestDto.name,
        description: createPlantRequestDto.description,
        image_src: createPlantRequestDto.imageSrc,
        color: createPlantRequestDto.color,
      },
    });
  }

  editPlant(editPlantRequestDto: EditPlantRequestDto, user: User) {
    return 'a'
  }
}
