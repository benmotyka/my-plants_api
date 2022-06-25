import { IsString } from "class-validator";

export class RegisterResponseDto {
  @IsString()
  status: string;

  constructor(status: string) {
    this.status = status;
  }
}
