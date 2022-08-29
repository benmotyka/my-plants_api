import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpsertSettingsResponseDto } from './dto/UpsertSettings.response.dto';

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
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async upsertSettings(
    @Body() settings: UpsertSettingsRequestDto,
    @Request() req,
  ): Promise<UpsertSettingsResponseDto> {
    this.logger.debug(`Changing settings for user: ${req.user.username}`);

    const result = await this.userService.upsertSettings(settings, req.user);

    return new UpsertSettingsResponseDto(result);
  }
}
