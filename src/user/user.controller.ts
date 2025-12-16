import { Body, Controller, Patch, Req } from '@nestjs/common';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AuthRequired()
  @Patch('/')
  async edit(@Req() req: AuthorizedRequest, @Body() dto: EditUserDto) {
    console.log('USER: ', req.user);
    return this.userService.edit(req.user, dto);
  }
}
