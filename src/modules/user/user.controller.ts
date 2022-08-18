import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';

import { RegisterResponseDto } from '@modules/auth/dto/RegisterResponse.dto';
import { UserService } from './user.service';
import { UpsertSettingsRequestDto } from './dto/UpsertSettingsRequest.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put('settings')
  @HttpCode(HttpStatus.OK)
  async upsertSettings(
    @Body() settings: UpsertSettingsRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.userService.upsertSettings(settings);

    return new RegisterResponseDto(result);
  }
}
