import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { type AuthorizedRequest, AuthRequired } from '../auth/guard/auth.guard';
import { CreateReactionDto } from './dto/reaction.dto';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get('/types')
  async findAllTypes() {
    return this.reactionService.findAllReactionTypes();
  }

  @AuthRequired()
  @Post('/')
  async create(@Req() req: AuthorizedRequest, dto: CreateReactionDto) {
    return await this.reactionService.createReaction(req.user, dto);
  }

  @AuthRequired()
  @Get('/message/:messageId')
  async findByMessage(
    @Req() req: AuthorizedRequest,
    @Param('messageId') messageId: number,
  ) {
    return this.reactionService.findByMessage(req.user, messageId);
  }
}
