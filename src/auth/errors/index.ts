import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const authError = {
  TAG_ALREADY_EXISTS: new BadRequestException(
    'user with this tag already exists',
  ),
  EMAIL_ALREADY_EXISTS: new BadRequestException(
    'user with this email already exists',
  ),
  LOGIN_ERROR: new BadRequestException(
    'user with this email or tag not exist or password incorrect',
  ),
  UNDEFINED_AUTH_ERROR: new InternalServerErrorException(),
};
