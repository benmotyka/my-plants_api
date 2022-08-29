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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordResponseDto } from './dto/ChangePasswordResponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register new user account',
  })
  @ApiResponse({
    status: 200,
    description: 'Response status',
    type: RegisterResponseDto,
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(registerRequestDto);

    return new RegisterResponseDto(result);
  }

  @ApiOperation({
    summary: 'Login user to service',
    description:
      'Generates jwt access token based on the "username" and "password" fields',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token and user settings',
    type: LoginResponseDto,
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<LoginResponseDto> {
    const result = await this.authService.login(req.user);

    return new LoginResponseDto(result);
  }

  @ApiOperation({
    summary: 'Update user password',
  })
  @ApiResponse({
    status: 200,
    description: 'Response status',
    type: ChangePasswordResponseDto,
  })
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

    return new ChangePasswordResponseDto(result);
  }
}
