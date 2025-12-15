import { Controller, Get, Param } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('chat/:chatId')
  async findChatMembers(@Param('chatId') chatId: number) {
    return this.memberService.getChatMembers(chatId);
  }
}
