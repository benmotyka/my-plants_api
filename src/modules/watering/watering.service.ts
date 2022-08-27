import * as dayjs from 'dayjs';
import { User } from '.prisma/client';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseType } from '@enums/ResponseType';
import { PrismaService } from '@modules/prisma/prisma.service';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { WateringData } from '@modules/watering/dto/GetAllWateringsForPlantResponse.dto';

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
        createdAt: true,
      },
      where: {
        plantId: plant.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let response: WateringData = {};
    waterings.forEach((item) => {
      const day = dayjs(item.createdAt).format('YYYY-MM-DD');
      if (!response[day]) {
        response = {
          ...response,
          [day]: [],
        };
      }
      response[day].push(item.createdAt);
    });

    return response;
  }
}
