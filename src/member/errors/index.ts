import { BadRequestException, NotFoundException } from '@nestjs/common';

export const memberError = {
  NOT_A_MEMBER: new BadRequestException('you must be a member of this chat'),
  SUPER_ADMIN_ALREADY_EXISTS: new BadRequestException(
    'super admin already exists',
  ),
  NO_ACCESS: new BadRequestException('member not have access to this action'),
  SET_NEXT_ADMIN: new BadRequestException(
    'if super admin leaves the chat he must select next super admin',
  ),
  NOT_FOUND: new NotFoundException('member not found'),
};
