import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsArray } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsUUID()
  @IsNotEmpty()
  typeId: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsUUID()
  @IsNotEmpty()
  locationId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  collaboratorIds?: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  relatedEventIds?: string[];
}
