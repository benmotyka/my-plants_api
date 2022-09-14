import dayjs from 'dayjs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ResponseType } from '@enums/ResponseType';
import { PrismaService } from '@modules/prisma/prisma.service';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { WateringData } from '@modules/watering/dto/GetAllWateringsForPlantResponse.dto';
import { Exception } from '@enums/Exception';

@Injectable()
export class WateringService {
  constructor(private prisma: PrismaService) {}

  async waterPlant(
    waterPlantRequestDto: WaterPlantRequestDto,
    deviceId: string,
  ): Promise<ResponseType> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: waterPlantRequestDto.plantId,
        user: {
          deviceId,
        },
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
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
    deviceId: string,
  ): Promise<WateringData> {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id: plantId,
        user: {
          deviceId,
        },
      },
    });

    if (!plant) {
      throw new BadRequestException(Exception.INVALID_PLANT);
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
