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
  Put,
} from '@nestjs/common';

import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { CreatePlantResponseResponseDto } from '@modules/plant/dto/CreatePlantResponse.dto';
import { DeletePlantResponseDto } from '@modules/plant/dto/DeletePlantResponse.dto';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { EditPlantResponseResponseDto } from '@modules/plant/dto/EditPlantResponseResponse.dto';
import { GetAllPlantsResponseDto } from '@modules/plant/dto/GetAllPlantsResponse.dto';
import { PlantService } from '@modules/plant/plant.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';
import { ImportPlantResponseResponseDto } from './dto/ImportPlantResponse.dto';
import { ImportPlantRequestDto } from './dto/ImportPlantRequest.dto';

@ApiTags('Plants')
@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
  private readonly logger = new Logger(PlantController.name);

  @ApiOperation({
    summary: 'Get all plants for user',
  })
  @ApiResponse({
    status: 200,
    description: 'User plants',
    type: GetAllPlantsResponseDto,
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllPlants(@DeviceId() deviceId): Promise<GetAllPlantsResponseDto> {
    this.logger.debug(`Getting all plants for device of id: ${deviceId}`);
    const plants = await this.plantService.getAllPlants(deviceId);

    return new GetAllPlantsResponseDto(plants);
  }

  @ApiOperation({
    summary: 'Create plant',
  })
  @ApiResponse({
    status: 201,
    description: 'Created plant',
    type: CreatePlantResponseResponseDto,
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createPlant(
    @Body() payload: CreatePlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<CreatePlantResponseResponseDto> {
    this.logger.debug(
      `Creating plant for device of id: ${deviceId} with name: ${payload.name}`,
    );
    const plant = await this.plantService.createPlant(payload, deviceId);

    return new CreatePlantResponseResponseDto(plant);
  }

  @ApiOperation({
    summary: 'Import plant',
  })
  @ApiResponse({
    status: 201,
    description: 'Imported plant',
    type: ImportPlantResponseResponseDto,
  })
  @Post('import')
  @HttpCode(HttpStatus.CREATED)
  async importPlant(
    @Body() payload: ImportPlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<ImportPlantResponseResponseDto> {
    // @NOTE: Fake wait to prevent bruteforce
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const plant = await this.plantService.importPlant(payload, deviceId);

    return new ImportPlantResponseResponseDto(plant);
  }

  @ApiOperation({
    summary: 'Edit plant',
  })
  @ApiResponse({
    status: 200,
    description: 'Edited plant',
    type: EditPlantResponseResponseDto,
  })
  @Put('')
  async editPlant(
    @Body() payload: EditPlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<EditPlantResponseResponseDto> {
    this.logger.debug(
      `Updating plant for device of id: ${deviceId} with name: ${payload.name}`,
    );
    const plant = await this.plantService.editPlant(payload, deviceId);
    return new EditPlantResponseResponseDto(plant);
  }

  @ApiOperation({
    summary: 'Soft delete plant',
  })
  @ApiResponse({
    status: 200,
    description: 'Response status',
    type: DeletePlantResponseDto,
  })
  @Delete(':id')
  async deletePlant(
    @Param('id') id: string,
    @DeviceId() deviceId,
  ): Promise<DeletePlantResponseDto> {
    this.logger.debug(`Deleting plant for device of: ${deviceId}`);

    const result = await this.plantService.deletePlant(id, deviceId);

    return new DeletePlantResponseDto(result);
  }
}
