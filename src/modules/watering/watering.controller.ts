import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { WaterPlantRequestDto } from './dto/WaterPlantRequest.dto';
import { WaterPlantResponseDto } from './dto/WaterPlantResponse.dto';
import { WateringService } from './watering.service';

@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}
  private readonly logger = new Logger(WateringController.name);

  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async waterPlant(
    @Body() waterPlantRequestDto: WaterPlantRequestDto,
    @Request() req,
  ): Promise<WaterPlantResponseDto> {
      this.logger.debug(`Watering plant of id: ${waterPlantRequestDto.plantId} for user: ${req.user.username}`)

      const result = await this.wateringService.waterPlant(waterPlantRequestDto, req.user);

      return new WaterPlantResponseDto(result)
  }
}
