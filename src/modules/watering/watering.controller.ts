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
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { GetAllWateringsForPlantResponseDto } from './dto/GetAllWateringsForPlantResponse.dto';
import { WaterPlantRequestDto } from './dto/WaterPlantRequest.dto';
import { WaterPlantResponseDto } from './dto/WaterPlantResponse.dto';
import { WateringService } from './watering.service';

@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}
  private readonly logger = new Logger(WateringController.name);

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
