import { IsNotEmpty, IsString } from 'class-validator';

export class WaterPlantRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly plantId: string;
}
