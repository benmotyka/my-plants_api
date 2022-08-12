import { IsString } from 'class-validator';

export class WaterPlantResponseDto {
  @IsString()
  readonly status: string;

  constructor(status: string) {
    this.status = status;
  }
}
