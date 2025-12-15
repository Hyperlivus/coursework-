import { BadRequestException, NotFoundException } from '@nestjs/common';

export const NOT_FOUND = new NotFoundException('message not found');
export const CANNOT_EDIT_MESSAGE = new BadRequestException(
  'this user cannot edit message',
);
