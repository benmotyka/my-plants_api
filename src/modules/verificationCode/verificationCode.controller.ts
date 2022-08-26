import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { Controller, HttpCode, HttpStatus, Logger, Put, Request, UseGuards } from "@nestjs/common";
import { VerificationCodeService } from "./verificationCode.service";

@Controller('verification-code')
export class VerificationCodeController {
  constructor(private verificationCodeService: VerificationCodeService) {}
  private readonly logger = new Logger(VerificationCodeController.name);

  @Put('confirm-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    // @Body() ,
    @Request() req,
  ) {
    this.logger.debug(
      `Confirming email for user: ${req.user.username}`,
    );

    // const result = await this.verificationCodeService.confirmEmail();

    // return new RegisterResponseDto(result);
  }
}
