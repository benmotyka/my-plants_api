import * as dayjs from 'dayjs';

import { User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseType } from 'src/enums/ResponseType.enum';
import { PrismaService } from '../prisma/prisma.service';
import { WaterPlantRequestDto } from './dto/WaterPlantRequest.dto';
import { WateringData } from './dto/GetAllWateringsForPlantResponse.dto';

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

    // @TODO: check if there's any watering and if there is clear notified status

    return ResponseType.SUCCESS;
  }

  async getAllWateringsForPlant(
    plantId: string,
    user: User,
  ): Promise<WateringData> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: plantId,
        userId: user.id,
      },
    });

    if (!plant) {
      throw new BadRequestException('plant-not-found');
    }

    const waterings = await this.prisma.watering.findMany({
      select: {
        created_at: true,
      },
      where: {
        plantId: plant.id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    let response: WateringData = {};
    waterings.forEach((item) => {
      const day = dayjs(item.created_at).format('YYYY-MM-DD');
      if (!response[day]) {
        response = {
          ...response,
          [day]: [],
        };
      }
      response[day].push(item.created_at);
    });

    return response;
  }
}
