import { IsString } from "class-validator";

export class DeletePlantResponseDto {
  @IsString()
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }
}
