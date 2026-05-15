import { IsString, IsNotEmpty, IsHexColor } from 'class-validator';

export class CreateTypeDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsHexColor()
  @IsNotEmpty()
  colorHex: string;
}
