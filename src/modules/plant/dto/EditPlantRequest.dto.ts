import { IsNotEmpty, IsString } from 'class-validator';

import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';

export class EditPlantRequestDto extends CreatePlantRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
