import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
      return req.user
  }

}
