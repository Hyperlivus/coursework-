import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export const CHAT_WITH_TAG_ALREADY_EXISTS = new BadRequestException(
  'chat with this tag already',
);
export const UNDEFINED_CHAT_ERROR = new InternalServerErrorException(
  'undefined chat service error',
);
