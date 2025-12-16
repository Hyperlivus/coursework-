import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entity/reaction.entity';
import { Repository } from 'typeorm';
import { ReactionType } from './entity/reaction-type.entity';
import { User } from '../user/entry/user.entry';
import { CreateReactionDto } from './dto/reaction.dto';
import { MemberService } from '../member/member.service';
import { MessageService } from '../message/message.service';
import { messagesErrors } from '../message/errors';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(ReactionType)
    private readonly reactionTypeRepository: Repository<ReactionType>,
    private readonly memberService: MemberService,
    private readonly messageService: MessageService,
  ) {}

  async findAllReactionTypes() {
    return await this.reactionTypeRepository.find();
  }

  async createReaction(user: User, dto: CreateReactionDto) {
    const member = await this.memberService.findMemberSafe(user.id, dto.chatId);
    let reaction = this.reactionRepository.create({
      type: { id: dto.reactionTypeId },
      message: { id: dto.messageId },
      creator: member,
    });
    reaction = await this.reactionTypeRepository.save(reaction);

    return reaction;
  }

  async findByMessage(user: User, id: number) {
    const message = await this.messageService.findMessageById(id, {
      chat: true,
    });
    if (message === null) throw messagesErrors.NOT_FOUND;

    await this.memberService.findMemberSafe(user.id, message?.chat.id);

    return await this.reactionRepository
      .createQueryBuilder('r')
      .select('COUNT(r.id)', 'count')
      .where('r.messageId = :id', { id })
      .leftJoinAndSelect('r.type', 'rt', 'r.typeId = rt.id')
      .groupBy('rt.id')
      .getRawMany();
  }
}
