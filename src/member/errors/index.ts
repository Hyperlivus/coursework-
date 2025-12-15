import { BadRequestException } from '@nestjs/common';

export const SUPER_ADMIN_ONLY_ONE = new BadRequestException(
  'in chat can exist only one super admin',
);
export const DONT_HAVE_ACCESS_TO_CHAT = new BadRequestException(
  'user does not have access to chat',
);
