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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceId } from '@decorators/deviceId.decorator';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';
import { AddBugReportRequestDto } from './dto/AddBugReportRequest.dto';
import { UpsertPushNotificationsTokenRequestDto } from './dto/UpsertPushNotificationsTokenRequest.dto';

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

  @ApiOperation({
    summary: 'Upsert push notification token',
  })
  @ApiResponse({
    status: 200,
  })
  @Put('notifications')
  @HttpCode(HttpStatus.OK)
  async upsertPushNotificationsToken(
    @Body() payload: UpsertPushNotificationsTokenRequestDto,
    @DeviceId() deviceId,
  ): Promise<void> {
    this.logger.debug(`Upserting push notifications token: ${payload.token} for deviceId: ${deviceId}`);

    await this.userService.upsertPushNotificationsToken(payload, deviceId);
  }
}
