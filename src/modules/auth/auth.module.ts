import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    // imports: [UserService],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, LocalStrategy],
})
export class AuthModule {}
