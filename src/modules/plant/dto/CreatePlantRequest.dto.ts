import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';

export class CreatePlantRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @Trim()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly imageSrc?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}
