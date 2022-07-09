import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';

export class EditPlantRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Trim()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly imageSrc?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}
