import { NotFoundException } from '@nestjs/common';

export const reactionErrors = {
  TYPE_NOT_FOUND: new NotFoundException('reaction type not found'),
};
