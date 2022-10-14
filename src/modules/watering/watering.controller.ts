import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';

import { GetAllWateringsForPlantResponseDto } from '@modules/watering/dto/GetAllWateringsForPlantResponse.dto';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { WaterPlantResponseDto } from '@modules/watering/dto/WaterPlantResponse.dto';
import { WateringService } from '@modules/watering/watering.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';

@ApiTags('Watering')
@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}
  private readonly logger = new Logger(WateringController.name);

  @ApiOperation({
    summary: 'Gets all waterings for plant by plantId',
  })
  @ApiResponse({
    status: 200,
    description: 'List of waterings',
    type: GetAllWateringsForPlantResponseDto,
  })
  @Get(':plantId')
  @HttpCode(HttpStatus.OK)
  async getAllWateringsForPlant(
    @Param('plantId') plantId: string,
    @DeviceId() deviceId,
  ): Promise<GetAllWateringsForPlantResponseDto> {
    this.logger.debug(
      `Getting all waterings for plant of id: ${plantId} for device of id: ${deviceId}`,
    );

    const result = await this.wateringService.getAllWateringsForPlant(
      plantId,
      deviceId,
    );

    return new GetAllWateringsForPlantResponseDto(result);
  }

  @ApiOperation({
    summary: 'Creates watering for plant',
  })
  @ApiResponse({
    status: 201,
    description: 'Watering id',
    type: WaterPlantResponseDto,
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async waterPlant(
    @Body() waterPlantRequestDto: WaterPlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<WaterPlantResponseDto> {
    this.logger.debug(
      `Watering plant of id: ${waterPlantRequestDto.plantId} for device of id: ${deviceId}`,
    );

    const result = await this.wateringService.waterPlant(
      waterPlantRequestDto,
      deviceId,
    );

    return new WaterPlantResponseDto(result);
  }

  @ApiOperation({
    summary: 'Cancels watering of plant',
  })
  @ApiResponse({
    status: 200,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async cancelWatering(
    @Param('id') id: string,
    @DeviceId() deviceId,
  ): Promise<void> {
    this.logger.debug(
      `Canceling watering plant of id: ${id} done by user: ${deviceId}`,
    );

    await this.wateringService.cancelWatering(id, deviceId);
  }
}
