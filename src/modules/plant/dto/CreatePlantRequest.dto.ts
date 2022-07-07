import { IsString } from 'class-validator';
import { Trim } from 'src/decorators/transform.decorator';

export class CreatePlantRequestDto {
  @Trim()
  @IsString()
  readonly name: string;

  @Trim()
  @IsString()
  readonly description?: string;

  readonly imageSrc?: string;

  readonly color?: string;
}
