import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Trim } from '@decorators/transform.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantRequestDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(0, 25)
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @Trim()
  @IsString()
  @Length(0, 100)
  @ApiProperty()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly imageSrc?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly color?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  @ApiProperty()
  readonly wateringReminderFrequency?: number;
}
