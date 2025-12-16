import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { CreateMessageDto, EditMessageDto } from './dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  async create(@Req() req: AuthorizedRequest, @Body() dto: CreateMessageDto) {
    return this.messageService.createOne(req.user.id, dto);
  }

  @Patch('/:id')
  async edit(
    @Req() req: AuthorizedRequest,
    @Param('id') messageId: number,
    @Body() dto: EditMessageDto,
  ) {
    return this.messageService.editMessage(req.user, messageId, dto);
  }

  @Get('/fetch/:chatId')
  @AuthRequired()
  async fetchMessages(
    @Req() req: AuthorizedRequest,
    @Param('chatId') chatId: number,
    @Query('chunk') chunk: number,
    @Query('size') size?: number,
  ) {
    return this.messageService.fetchMessages(req.user, chatId, {
      chunk,
      size: size ?? 30,
    });
  }

  @Delete('/')
  async delete(@Req() req: AuthorizedRequest, @Param('id') messageId: number) {
    return this.messageService.deleteMessage(req.user.id, messageId);
  }
}
