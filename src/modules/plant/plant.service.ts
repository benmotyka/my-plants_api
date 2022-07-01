import { User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';

@Injectable()
export class PlantService {
  constructor(private prisma: PrismaService) {}

  async createPlant(createPlantRequestDto: CreatePlantRequestDto, user: User) {
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
}
