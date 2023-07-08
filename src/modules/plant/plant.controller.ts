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
import { EditPlantRequestDto } from '@modules/plant/dto/EditPlantRequest.dto';
import { EditPlantResponseResponseDto } from '@modules/plant/dto/EditPlantResponseResponse.dto';
import { GetAllPlantsResponseDto } from '@modules/plant/dto/GetAllPlantsResponse.dto';
import { PlantService } from '@modules/plant/plant.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';
import { ImportPlantResponseResponseDto } from './dto/ImportPlantResponse.dto';
import { ImportPlantRequestDto } from './dto/ImportPlantRequest.dto';
import { GetPlantImagesHistoryResponseDto } from './dto/GetPlantImagesHistoryResponse.dto';
import { UploadImageRequestDto } from './dto/UploadImageRequest.dto';

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
  async getAllPlants(
    @DeviceId() deviceId: string,
  ): Promise<GetAllPlantsResponseDto> {
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
    @DeviceId() deviceId: string,
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
    @DeviceId() deviceId: string,
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
    @DeviceId() deviceId: string,
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
  })
  @Delete(':id')
  async deletePlant(
    @Param('id') id: string,
    @DeviceId() deviceId: string,
  ): Promise<void> {
    this.logger.debug(`Deleting plant for device of: ${deviceId}`);

    return await this.plantService.deletePlant(id, deviceId);
  }

  @ApiOperation({
    summary: 'Uploads image (attachment) to plant',
  })
  @ApiResponse({
    status: 201,
    description: 'Response status',
  })
  @Post('images')
  async uploadImage(
    @Body() payload: UploadImageRequestDto,
    @DeviceId() deviceId: string,
  ): Promise<void> {
    this.logger.debug(
      `Uploading image for plant of id: ${payload.plantId} and device of id: ${deviceId}`,
    );

    return await this.plantService.uploadImage(payload, deviceId);
  }

  @ApiOperation({
    summary: 'Delete plant image (attachment)',
  })
  @ApiResponse({
    status: 200,
  })
  @Delete('images/:attachmentId')
  async deleteImage(
    @Param('attachmentId') attachmentId: string,
    @DeviceId() deviceId: string,
  ): Promise<void> {
    this.logger.debug(
      `Soft deleting attachment id: ${attachmentId} for device of id: ${deviceId}`,
    );
    return await this.plantService.deleteImage(attachmentId, deviceId);
  }

  @ApiOperation({
    summary: 'Get plants images history',
  })
  @ApiResponse({
    status: 200,
    description: 'History of attachments for given plant',
    type: GetPlantImagesHistoryResponseDto,
  })
  @Get('history/images/:id')
  async getPlantImagesHistory(
    @Param('id') id: string,
    @DeviceId() deviceId: string,
  ): Promise<GetPlantImagesHistoryResponseDto> {
    this.logger.debug(`Getting history of images for plantId: ${id}`);

    const result = await this.plantService.getPlantImagesHistory(id, deviceId);

    return new GetPlantImagesHistoryResponseDto(result);
  }
}
