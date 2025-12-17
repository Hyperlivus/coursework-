import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { CreateMemberDto, BanMemberDto, LeaveDto } from './dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @AuthRequired()
  @Post('/')
  async create(@Req() req: AuthorizedRequest, dto: CreateMemberDto) {
    return this.memberService.createOne(dto, req.user);
  }

  @AuthRequired()
  @Get('/my')
  async getMyMembers(@Req() req: AuthorizedRequest) {
    return this.memberService.getByUser(req.user.id);
  }

  @AuthRequired()
  @Get('chat/:chatId')
  async findChatMembers(@Param('chatId') chatId: number) {
    return this.memberService.getByChat(chatId);
  }

  @AuthRequired()
  @Delete('ban')
  async ban(@Req() req: AuthorizedRequest, @Body() dto: BanMemberDto) {
    return this.memberService.ban(req.user, dto.memberId);
  }

  @AuthRequired()
  @Delete('/leave')
  async leave(@Req() req: AuthorizedRequest, @Body() dto: LeaveDto) {
    return this.memberService.leave(req.user, dto);
  }

  @AuthRequired()
  @Patch('/role')
  async setRole(@Req() req: AuthorizedRequest, @Param('id') id: number) {}
}
