import { Plant } from '.prisma/client';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';
import { EditPlantRequestDto } from './dto/EditPlantRequest.dto';
import { PlantService } from './plant.service';

@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPlant(
    @Body() createPlantRequestDto: CreatePlantRequestDto,
    @Request() req,
  ): Promise<string> {
    const result = await this.plantService.createPlant(
      createPlantRequestDto,
      req.user,
    );

    return 'ok';
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async editPlant(
    @Body() editPlantRequestDto: EditPlantRequestDto,
    @Request() req,
  ): Promise<string> {
    const result = await this.plantService.editPlant(
      editPlantRequestDto,
      req.user,
    );
    return 'ok';
  }
}
