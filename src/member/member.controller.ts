import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { MemberService } from './member.service';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { MemberCreationDto } from './dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @AuthRequired()
  @Post('/')
  async create(@Req() req: AuthorizedRequest, dto: MemberCreationDto) {
    return this.memberService.create(dto, req.user);
  }

  @AuthRequired()
  @Get('chat/:chatId')
  async findChatMembers(@Param('chatId') chatId: number) {
    return this.memberService.getChatMembers(chatId);
  }

  @AuthRequired()
  @Delete('/:id')
  async banMember(@Req() req: AuthorizedRequest, @Param('id') id: number) {
    return this.memberService.deleteMember(req.user, id);
  }
}
