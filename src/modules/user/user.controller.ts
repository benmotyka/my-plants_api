import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Put,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsequest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpsertSettingsResponseDto } from './dto/UpsertSettingsResponse.dto';
import { DeviceId } from '@decorators/deviceId.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @ApiOperation({
    summary: 'Update user settings',
  })
  @ApiResponse({
    status: 200,
    description: 'Response status',
    type: UpsertSettingsResponseDto,
  })
  @Put('settings')
  @HttpCode(HttpStatus.OK)
  async upsertSettings(
    @Body() settings: UpsertSettingsRequestDto,
    @DeviceId() deviceId,
  ): Promise<UpsertSettingsResponseDto> {
    this.logger.debug(`Changing settings for user: ${deviceId}`);

    const result = await this.userService.upsertSettings(settings, deviceId);

    return new UpsertSettingsResponseDto(result);
  }
}
