import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ChatCreationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(96)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description: string;
}
