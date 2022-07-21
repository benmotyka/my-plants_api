import { User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseType } from 'src/enums/ResponseType.enum';
import { PrismaService } from '../prisma/prisma.service';
import { WaterPlantRequestDto } from './dto/WaterPlantRequest.dto';

@Injectable()
export class WateringService {
  constructor(private prisma: PrismaService) {}

  async waterPlant(
    waterPlantRequestDto: WaterPlantRequestDto,
    user: User,
  ): Promise<ResponseType> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: waterPlantRequestDto.plantId,
        userId: user.id,
      },
    });

    if (!plant) {
      throw new BadRequestException('plant-not-found');
    }

    await this.prisma.watering.create({
      data: {
        plantId: plant.id,
      },
    });

    return ResponseType.SUCCESS;
  }
}
