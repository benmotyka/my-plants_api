import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    // @TODO: add type
    type: 'string',
  })
  @Put('confirm-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    // @Body() ,
    @Request() req,
  ) {
    this.logger.debug(`Confirming email for user: ${req.user.username}`);

    // const result = await this.verificationCodeService.confirmEmail();
  }
}
