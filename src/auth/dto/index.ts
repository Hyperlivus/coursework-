import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { PASSWORD_REGEXP, TAG_REGEXP } from '../../constant';

export class LoginDTO {
  @IsString()
  emailOrTag: string;

  @IsString()
  @Matches(PASSWORD_REGEXP)
  password: string;
}

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(TAG_REGEXP)
  tag: string;

  @IsString()
  @MaxLength(128)
  nickname: string;

  @Matches(PASSWORD_REGEXP)
  password: string;
}
