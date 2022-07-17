import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';

export class CreatePlantRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(0, 25)
  readonly name: string;

  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 100)
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly imageSrc?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}
