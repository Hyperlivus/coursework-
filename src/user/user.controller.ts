import { Body, Controller, Get, Patch, Query, Req } from '@nestjs/common';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AuthRequired()
  @Patch('/')
  async edit(@Req() req: AuthorizedRequest, @Body() dto: EditUserDto) {
    return this.userService.edit(req.user, dto);
  }

  @AuthRequired()
  @Get('/search')
  async search(@Query('query') query: string) {
    return this.userService.search(query);
  }
}
