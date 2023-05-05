import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsequest.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';
import { AddBugReportRequestDto } from './dto/AddBugReportRequest.dto';

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
  })
  @Put('settings')
  @HttpCode(HttpStatus.OK)
  async upsertSettings(
    @Body() settings: UpsertSettingsRequestDto,
    @DeviceId() deviceId,
  ): Promise<void> {
    this.logger.debug(`Changing settings for user: ${deviceId}`);

    return await this.userService.upsertSettings(settings, deviceId);
  }

  @ApiOperation({
    summary: 'Add bug report',
  })
  @ApiResponse({
    status: 200,
  })
  @Post('bug-report')
  @HttpCode(HttpStatus.OK)
  async addBugReport(
    @Body() bugReport: AddBugReportRequestDto,
    @DeviceId() deviceId,
  ): Promise<void> {
    this.logger.debug(`Adding bug report for user: ${deviceId}`);

    await this.userService.addBugReport(bugReport, deviceId);
  }
}
