import { DeviceId } from '@decorators/deviceId.decorator';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
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
  @HttpCode(HttpStatus.OK)
  async sendEmailConfirmation(
    @Body() payload: SendEmailConfirmationRequestDto,
    @DeviceId() deviceId,
  ) {
    this.logger.debug(
      `Sending email confirmation to email: ${payload.email} for user: ${deviceId}`,
    );

    const result = await this.verificationCodeService.sendEmailConfirmation(
      payload,
      deviceId,
    );

    return new SendEmailConfirmationResponseDto(result);
  }
}
