import { IsNotEmpty, IsString } from 'class-validator';

import { CreatePlantRequestDto } from '@modules/plant/dto/CreatePlantRequest.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EditPlantRequestDto extends CreatePlantRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: string;
}
