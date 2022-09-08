import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendEmailConfirmationRequestDto } from './dto/SendEmailConfirmation.request.dto';
import { SendEmailConfirmationResponseDto } from './dto/SendEmailConfirmation.response.dto';
import { VerificationCodeService } from './verificationCode.service';

@ApiTags('Verification code')
@Controller('verification-code')
export class VerificationCodeController {
  constructor(private verificationCodeService: VerificationCodeService) {}
  private readonly logger = new Logger(VerificationCodeController.name);

  @ApiOperation({
    summary: 'Send confirmation code to user email',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmation sent',
    type: SendEmailConfirmationResponseDto,
  })
  @Post('email/send')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendEmailConfirmation(
    @Body() payload: SendEmailConfirmationRequestDto,
    @Request() req,
  ) {
    this.logger.debug(
      `Sending email confirmation to email: ${payload.email} for user: ${req.user.username}`,
    );

    const result = await this.verificationCodeService.sendEmailConfirmation(
      payload,
      req.user,
    );

    return new SendEmailConfirmationResponseDto(result);
  }
}
