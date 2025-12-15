import { Body, Controller, Patch, Req } from '@nestjs/common';
import { AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';

@AuthRequired()
@Controller('user')
export class UserController {
  @Patch('/')
  async edit(@Req() req: AuthorizedRequest, @Body() dto) {}
}
