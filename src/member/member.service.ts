import { Injectable } from '@nestjs/common';
import { MemberCreationDto } from './dto/member.dto';
import { User } from '../user/entry/user.entry';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, Role } from './entity/member.entity';
import { Repository } from 'typeorm';
import { DONT_HAVE_ACCESS_TO_CHAT, SUPER_ADMIN_ONLY_ONE } from './errors';

const ROLE_ACCESSES: Record<Role, number> = {
  [Role.MEMBER]: 1,
  [Role.ADMIN]: 2,
  [Role.SUPER_ADMIN]: 3,
};

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async superAdminAlreadyExists(chatId: number) {
    const superAdminMember = await this.memberRepository.findOne({
      where: {
        chat: { id: chatId },
        role: Role.SUPER_ADMIN,
      },
    });

    return superAdminMember !== null;
  }

  async findMember(
    userId: number,
    chatId: number,
    options = {
      throwError: true,
    },
    repository = this.memberRepository,
  ) {
    const member = await repository.findOne({
      where: {
        user: {
          id: userId,
        },
        chat: {
          id: chatId,
        },
      },
    });
    if (options.throwError && member === null) throw DONT_HAVE_ACCESS_TO_CHAT;
    return member;
  }

  async getChatMembers(chatId: number) {
    return await this.memberRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
    });
  }

  async create(
    user: User,
    dto: MemberCreationDto,
    repository = this.memberRepository,
  ) {
    if (
      dto.role === Role.SUPER_ADMIN &&
      (await this.superAdminAlreadyExists(dto.chatId))
    )
      throw SUPER_ADMIN_ONLY_ONE;

    const member = repository.create({
      role: dto.role ?? Role.MEMBER,
      chat: {
        id: dto.chatId,
      },
      user,
    });

    return this.memberRepository.save(member);
  }

  haveAccess(member: Member, role: Role) {
    const memberRole = member.role;
    return ROLE_ACCESSES[memberRole] >= ROLE_ACCESSES[role];
  }
}
