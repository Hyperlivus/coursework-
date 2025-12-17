import { Injectable } from '@nestjs/common';
import { ChatCreationDto } from './dto';
import { DataSource, ILike, QueryFailedError, Repository } from 'typeorm';
import { Chat } from './entity/chat.entry';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CHAT_WITH_TAG_ALREADY_EXISTS, UNDEFINED_CHAT_ERROR } from './errors';
import { User } from '../user/entry/user.entry';
import { Member, Role } from '../member/entity/member.entity';
import { MemberService } from '../member/member.service';

const TAG_NOT_UNIQUE = '';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly repository: Repository<Chat>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly memberService: MemberService,
  ) {}

  async createChatEntity(dto: ChatCreationDto, repository = this.repository) {
    const chat = repository.create(dto);
    const res = await repository.save(chat).catch((err: QueryFailedError) => {
      const { code } = err as any;
      if (code === TAG_NOT_UNIQUE) return CHAT_WITH_TAG_ALREADY_EXISTS;
      return UNDEFINED_CHAT_ERROR;
    });

    if (res instanceof Error) throw res;

    return res;
  }

  async createOne(user: User, dto: ChatCreationDto) {
    return await this.dataSource.transaction(async (entityManager) => {
      const chatRepository = entityManager.getRepository(Chat);
      const memberRepository = entityManager.getRepository(Member);

      const chat = await this.createChatEntity(dto, chatRepository);
      const member = await this.memberService.createOne(
        {
          chatId: chat.id,
          role: Role.SUPER_ADMIN,
          userId: user.id,
        },
        undefined,
        memberRepository,
      );

      return {
        chat,
        member,
      };
    });
  }

  async search(query: string) {
    return await this.repository.find({
      where: [
        { tag: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) },
      ],
      take: 10,
    });
  }

  //TODO зробити якщо буде час
  // async statistics(chatId: number) {
  //   return await this.repository.createQueryBuilder('chat');
  // }
}
