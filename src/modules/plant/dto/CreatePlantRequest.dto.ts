import { IsOptional, IsString } from "class-validator";
import { Trim } from "src/decorators/transform.decorator";

export class CreatePlantRequestDto {
  @Trim()
  @IsString()
  name: string;

  @Trim()
  @IsString()
  description?: string;

  @IsString()
  imageSrc?: string;
  
  @IsString()
  color?: string;
}
