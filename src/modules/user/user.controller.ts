import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { RegisterResponseDto } from './dto/RegisterResponse.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerRequestDto: RegisterRequestDto): Promise<RegisterResponseDto> {
      const result = await this.userService.register(registerRequestDto)

      return new RegisterResponseDto(result)
  }
}
