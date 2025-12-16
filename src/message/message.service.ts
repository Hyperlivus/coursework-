import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entry/message.entry';
import { CreateMessageDto, EditMessageDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberService } from '../member/member.service';
import { User } from '../user/entry/user.entry';
import { Role } from '../member/entity/member.entity';
import { messagesErrors } from './errors';

export interface MessagesFetchParams {
  chunk: number;
  size: number;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject() private readonly memberService: MemberService,
  ) {}

  async createOne(userId: number, dto: CreateMessageDto) {
    const member = await this.memberService.findMemberSafe(userId, dto.chatId);
    const message = this.messageRepository.create({
      creator: member,
      chat: {
        id: dto.chatId,
      },
    });

    return this.messageRepository.save(message);
  }

  async editMessage(user: User, messageId: number, dto: EditMessageDto) {
    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
      },
      relations: {
        chat: true,
        creator: {
          user: true,
        },
      },
    });
    if (!message) throw messagesErrors.NOT_FOUND;

    const { creator } = message;
    if (creator?.user.id !== user.id) {
      const myMember = await this.memberService.findMemberSafe(
        user.id,
        message.chat.id,
      );
      if (!this.memberService.haveAccess(myMember, Role.SUPER_ADMIN))
        throw messagesErrors.NO_ACCESS;
    }

    return await this.messageRepository.update(message, {
      content: dto.content,
    });
  }

  async deleteMessage(userId: number, messageId: number) {
    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
      },
      relations: {
        chat: true,
        creator: {
          user: true,
        },
      },
    });

    if (!message) throw messagesErrors.NOT_FOUND;
    const { creator } = message;

    if (creator?.user.id !== userId) {
      const myMember = await this.memberService.findMemberSafe(
        userId,
        message.chat.id,
      );
      if (!this.memberService.haveAccess(myMember, Role.ADMIN))
        throw messagesErrors.NO_ACCESS;
    }

    return await this.messageRepository.delete(message);
  }

  async fetchMessages(user: User, chatId: number, params: MessagesFetchParams) {
    await this.memberService.findMember(chatId, user.id);

    return await this.messageRepository.find({
      where: {
        creator: {
          chat: {
            id: chatId,
          },
        },
      },
      relations: {
        creator: true,
      },
      skip: params.chunk * params.size,
      take: params.size,
    });
  }
}
