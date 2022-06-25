import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreatePlantRequestDto } from './dto/CreatePlantRequest.dto';
import { PlantService } from './plant.service';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createPlant(@Body() createPlantRequestDto: CreatePlantRequestDto): Promise<string> {
      const result = await this.plantService.createPlant(createPlantRequestDto)

      return 'ok'
  }
}
