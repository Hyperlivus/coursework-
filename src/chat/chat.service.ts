import { Inject, Injectable } from '@nestjs/common';
import { ChatCreationDto } from './dto';
import { DataSource, ILike, QueryFailedError, Repository } from 'typeorm';
import { Chat } from './entity/chat.entry';
import { InjectRepository } from '@nestjs/typeorm';
import { CHAT_WITH_TAG_ALREADY_EXISTS, UNDEFINED_CHAT_ERROR } from './errors';
import { User } from '../user/entry/user.entry';
import { Member, Role } from '../member/entity/member.entity';
import { MemberService } from '../member/member.service';

const TAG_NOT_UNIQUE = '';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly repository: Repository<Chat>,
    @Inject() private readonly dataSource: DataSource,
    private readonly memberService: MemberService,
  ) {}

  async createChat(dto: ChatCreationDto, repository = this.repository) {
    const chat = this.repository.create(dto);
    const res = await this.repository
      .save(chat)
      .catch((err: QueryFailedError) => {
        const { code } = err as any;
        if (code === TAG_NOT_UNIQUE) return CHAT_WITH_TAG_ALREADY_EXISTS;
        return UNDEFINED_CHAT_ERROR;
      });

    if (res instanceof Error) throw res;

    return res;
  }

  async create(user: User, dto: ChatCreationDto) {
    return await this.dataSource.transaction(async (entityManager) => {
      const chatRepository = entityManager.getRepository(Chat);
      const memberRepository = entityManager.getRepository(Member);

      const chat = await this.createChat(dto, chatRepository);
      const member = await this.memberService.create(
        user,
        {
          chatId: chat.id,
          role: Role.SUPER_ADMIN,
        },
        memberRepository,
      );

      return {
        chat,
        member,
      };
    });
  }

  async search(query: string) {
    // TODO: overwrite after
    return await this.repository.find({
      where: [
        { tag: ILike(`%${query}`) },
        { name: ILike(`%${query}`) },
        { description: ILike(`%${query}`) },
      ],
    });
  }
}
