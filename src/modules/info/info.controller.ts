import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetLastPatchNotesResponseDto } from './dto/GetLastPatchNotesResponse.dto';
import { InfoService } from './info.service';

@ApiTags('Info')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}
  private readonly logger = new Logger(InfoController.name);

  @ApiOperation({
    summary: 'Checks health of app',
  })
  @ApiResponse({
    status: 200,
    type: 'string',
  })
  @Get('healthcheck')
  @HttpCode(HttpStatus.OK)
  async getHealthCheck() {
    this.logger.debug(`Getting healthcheck`);

    return 'ok';
  }

  @ApiOperation({
    summary: 'Get last patch notes with changes',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of patch notes',
    type: GetLastPatchNotesResponseDto,
  })
  @Get('patch-notes/:amount')
  @HttpCode(HttpStatus.OK)
  async getLastPatchNotes(
    @Param('amount', ParseIntPipe) amount: number,
  ): Promise<GetLastPatchNotesResponseDto> {
    this.logger.debug(`Getting last ${amount} patch notes`);

    const patchNotes = await this.infoService.getLastPatchNotes(amount);

    return new GetLastPatchNotesResponseDto(patchNotes);
  }
}
