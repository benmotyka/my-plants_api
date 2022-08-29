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
  async getAllPlants(@Request() req): Promise<GetAllPlantsResponseDto> {
    this.logger.debug(`Getting all plants for user: ${req.user.username}`);
    const plants = await this.plantService.getAllPlants(req.user);

    return new GetAllPlantsResponseDto(plants);
  }

  @ApiOperation({
    summary: 'Create plant',
  })
  @ApiResponse({
    status: 200,
    description: 'Created plant',
    type: CreatePlantResponseResponseDto,
  })
  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPlant(
    @Body() createPlantRequestDto: CreatePlantRequestDto,
    @Request() req,
  ): Promise<CreatePlantResponseResponseDto> {
    this.logger.debug(
      `Creating plant for user: ${req.user.username} with name: ${createPlantRequestDto.name}`,
    );
    const plant = await this.plantService.createPlant(
      createPlantRequestDto,
      req.user,
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
    @Request() req,
  ): Promise<EditPlantResponseResponseDto> {
    this.logger.debug(
      `Updating plant for user: ${req.user.username} with name: ${editPlantRequestDto.name}`,
    );
    const plant = await this.plantService.editPlant(
      editPlantRequestDto,
      req.user,
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
    @Request() req,
  ): Promise<DeletePlantResponseDto> {
    this.logger.debug(
      `Deleting plant for user: ${req.user.username} of id: ${id}`,
    );
    const result = await this.plantService.deletePlant(id, req.user);

    return new DeletePlantResponseDto(result);
  }
}
