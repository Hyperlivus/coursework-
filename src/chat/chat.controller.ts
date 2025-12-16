import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ChatCreationDto } from './dto';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @AuthRequired()
  @Post('/')
  async create(@Req() req: AuthorizedRequest, @Body() dto: ChatCreationDto) {
    return this.chatService.create(req.user, dto);
  }

  @Get('/search')
  async search(@Query('query') query: string) {
    return this.chatService.search(query);
  }

  @Get('/statistic')
  async statistic(@Param('id') chatId: number) {}
}
