import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

export const USER_WITH_EMAIL_ALREADY_EXISTS = new BadRequestException(
  'user with this email already exists',
);
export const USER_WITH_TAG_ALREADY_EXISTS_SUCCESS = new BadRequestException(
  'user with this tag already exists',
);

export const LOGIN_ERROR = new UnauthorizedException(
  'user with this email or tag not exist or password incorrect',
);
export const UNDEFINED_AUTH_ERROR = new InternalServerErrorException();
