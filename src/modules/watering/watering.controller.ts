import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { GetAllWateringsForPlantResponseDto } from '@modules/watering/dto/GetAllWateringsForPlantResponse.dto';
import { WaterPlantRequestDto } from '@modules/watering/dto/WaterPlantRequest.dto';
import { WaterPlantResponseDto } from '@modules/watering/dto/WaterPlantResponse.dto';
import { WateringService } from '@modules/watering/watering.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllWateringsForPlant(
    @Param('plantId') plantId: string,
    @Request() req,
  ): Promise<GetAllWateringsForPlantResponseDto> {
    this.logger.debug(
      `Getting all waterings for plant of id: ${plantId} for user: ${req.user.username}`,
    );

    const result = await this.wateringService.getAllWateringsForPlant(
      plantId,
      req.user,
    );

    return new GetAllWateringsForPlantResponseDto(result);
  }

  @ApiOperation({
    summary: 'Creates watering for plant',
  })
  @ApiResponse({
    status: 201,
    description: 'Response status',
    type: WaterPlantResponseDto,
  })
  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async waterPlant(
    @Body() waterPlantRequestDto: WaterPlantRequestDto,
    @Request() req,
  ): Promise<WaterPlantResponseDto> {
    this.logger.debug(
      `Watering plant of id: ${waterPlantRequestDto.plantId} for user: ${req.user.username}`,
    );

    const result = await this.wateringService.waterPlant(
      waterPlantRequestDto,
      req.user,
    );

    return new WaterPlantResponseDto(result);
  }
}
