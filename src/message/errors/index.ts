import { BadRequestException, NotFoundException } from '@nestjs/common';

export const messagesErrors = {
  NOT_FOUND: new NotFoundException('message not found'),
  NO_ACCESS: new BadRequestException('you cannot delete or edit this message'),
};
