import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

const PASSWORD_REGEXP = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
const TAG_REGEXP = /([a-z0-9_])$/;

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
