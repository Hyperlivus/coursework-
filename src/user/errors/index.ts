import { InternalServerErrorException } from '@nestjs/common';

export const userErrors = {
  UNKNOWN_EDIT_ERROR: new InternalServerErrorException(),
};
