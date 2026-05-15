import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateAttendeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  checkedIn?: boolean;

  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
