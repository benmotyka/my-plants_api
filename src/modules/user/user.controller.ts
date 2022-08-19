import { Body, Controller, HttpCode, HttpStatus, Logger, Put, Request, UseGuards } from '@nestjs/common';

import { RegisterResponseDto } from '@modules/auth/dto/RegisterResponse.dto';
import { UserService } from './user.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async upsertSettings(
    @Body() settings: UpsertSettingsRequestDto,
    @Request() req,
  ): Promise<RegisterResponseDto> {
    this.logger.debug(
      `Changing settings for user: ${req.user.username}`,
    );

    const result = await this.userService.upsertSettings(settings, req.user);

    return new RegisterResponseDto(result);
  }
}
