import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/LoginResponse.dto';
import { RegisterRequestDto } from './dto/RegisterRequest.dto';
import { RegisterResponseDto } from './dto/RegisterResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerRequestDto: RegisterRequestDto): Promise<RegisterResponseDto> {
      const result = await this.authService.register(registerRequestDto)

      return new RegisterResponseDto(result)
  }


  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<LoginResponseDto> {
    const result = await this.authService.login(req.user);
    
    return new LoginResponseDto(result);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    this.logger.debug(`Getting info for user: ${req.user.username}`)
    return req.user;
  }
}
