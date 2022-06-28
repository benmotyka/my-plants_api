import { IsString, MinLength, MaxLength } from "class-validator";
import { Trim } from "src/decorators/transform.decorator";

export class RegisterRequestDto {
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    @Trim()
    username: string;
  
    @IsString()
    @MinLength(6)
    @Trim()
    password: string;
  }
  