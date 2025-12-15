import { IsString, Matches, MaxLength, IsOptional } from 'class-validator';
import { PASSWORD_REGEXP, TAG_REGEXP } from '../../constant';

export class EditUserDto {
  @IsOptional()
  @Matches(PASSWORD_REGEXP)
  password?: string;

  @IsOptional()
  @Matches(TAG_REGEXP)
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  bio?: string;
}
