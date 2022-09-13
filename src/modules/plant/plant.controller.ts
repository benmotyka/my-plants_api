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
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { CreatePlantResponseResponseDto } from '@modules/plant/dto/CreatePlantResponse.dto';
import { DeletePlantResponseDto } from '@modules/plant/dto/DeletePlantResponse.dto';
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { EditPlantResponseResponseDto } from '@modules/plant/dto/EditPlantResponseResponse.dto';
import { GetAllPlantsResponseDto } from '@modules/plant/dto/GetAllPlantsResponse.dto';
import { PlantService } from '@modules/plant/plant.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';

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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPlant(
    @Body() createPlantRequestDto: CreatePlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<CreatePlantResponseResponseDto> {
    this.logger.debug(
      `Creating plant for device of id: ${deviceId} with name: ${createPlantRequestDto.name}`,
    );
    const plant = await this.plantService.createPlant(
      createPlantRequestDto,
      deviceId,
    );

    return new CreatePlantResponseResponseDto(plant);
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
  @UseGuards(JwtAuthGuard)
  async editPlant(
    @Body() editPlantRequestDto: EditPlantRequestDto,
    @DeviceId() deviceId,
  ): Promise<EditPlantResponseResponseDto> {
    this.logger.debug(
      `Updating plant for device of id: ${deviceId} with name: ${editPlantRequestDto.name}`,
    );
    const plant = await this.plantService.editPlant(
      editPlantRequestDto,
      deviceId,
    );
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
  @UseGuards(JwtAuthGuard)
  async deletePlant(
    @Param('id') id: string,
    @DeviceId() deviceId,
  ): Promise<DeletePlantResponseDto> {
    this.logger.debug(`Deleting plant for device of: ${deviceId}`);

    const result = await this.plantService.deletePlant(id, deviceId);

    return new DeletePlantResponseDto(result);
  }
}
