import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from '@guards/local-auth.guard';
import { AuthService } from '@modules/auth/auth.service';
import { LoginResponseDto } from '@modules/auth/dto/LoginResponse.dto';
import { RegisterRequestDto } from '@modules/auth/dto/RegisterRequest.dto';
import { RegisterResponseDto } from '@modules/auth/dto/RegisterResponse.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { ChangePasswordRequestDto } from './dto/ChangePasswordRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(registerRequestDto);

    return new RegisterResponseDto(result);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<LoginResponseDto> {
    const result = await this.authService.login(req.user);

    return new LoginResponseDto(result);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordRequestDto: ChangePasswordRequestDto,
    @Request() req,
  ) {
    const result = await this.authService.changePassword(
      changePasswordRequestDto,
      req.user,
    );

    return new RegisterResponseDto(result);
  }
}
