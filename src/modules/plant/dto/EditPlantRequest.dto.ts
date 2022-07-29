import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePlantRequestDto } from './CreatePlantRequest.dto';

export class EditPlantRequestDto extends CreatePlantRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
