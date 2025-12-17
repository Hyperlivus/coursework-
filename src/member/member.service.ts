import { Injectable } from '@nestjs/common';
import { CreateMemberDto, LeaveDto } from './dto/member.dto';
import { User } from '../user/entry/user.entry';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Member, Role } from './entity/member.entity';
import { DataSource, Repository } from 'typeorm';
import { memberError } from './errors';

const ROLE_ACCESSES: Record<Role, number> = {
  [Role.MEMBER]: 1,
  [Role.ADMIN]: 2,
  [Role.SUPER_ADMIN]: 3,
};

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectDataSource() private dataSource: DataSource,
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
    repository: Repository<Member> = this.memberRepository,
  ) {
    return await repository.findOne({
      where: {
        user: {
          id: userId,
        },
        chat: { id: chatId },
      },
    });
  }

  async findMemberSafe(
    userId: number,
    chatId: number,
    repository = this.memberRepository,
  ) {
    const member = await this.findMember(userId, chatId, repository);
    if (!member) throw memberError.NOT_A_MEMBER;
    return member;
  }

  async getByChat(chatId: number) {
    return await this.memberRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        user: true,
      },
    });
  }

  async getByUser(userId: number) {
    return await this.memberRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        chat: true,
      },
    });
  }

  async createOne(
    dto: CreateMemberDto,
    adminUser?: User,
    repository = this.memberRepository,
  ) {
    if (adminUser !== undefined) {
      const adminMember = await this.findMemberSafe(adminUser.id, dto.chatId);
      const role = dto.role ?? Role.MEMBER;
      const requiredRole = role === Role.MEMBER ? Role.ADMIN : Role.SUPER_ADMIN;
      const access = this.haveAccess(adminMember, requiredRole);
      if (!access) {
        throw memberError.NO_ACCESS;
      }
    }

    if (
      dto.role === Role.SUPER_ADMIN &&
      (await this.superAdminAlreadyExists(dto.chatId))
    )
      throw memberError.SUPER_ADMIN_ALREADY_EXISTS;

    const member = repository.create({
      role: dto.role ?? Role.MEMBER,
      chat: {
        id: dto.chatId,
      },
      user: {
        id: dto.userId,
      },
    });

    return repository.save(member);
  }

  async changeRole(
    memberId: number,
    newRole: Role,
    canSetSuperAdmin: boolean = false,
    repository = this.memberRepository,
  ) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: {
        chat: true,
      },
    });

    if (member === null) throw memberError.NOT_FOUND;
    if (newRole === Role.SUPER_ADMIN && !canSetSuperAdmin)
      throw memberError.NO_ACCESS;

    await repository.update(memberId, {
      role: newRole,
    });
  }

  async ban(user: User, memberId: number) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: {
        user: true,
      },
    });

    if (!member) throw memberError.NOT_FOUND;

    const myMember = await this.findMemberSafe(user.id, memberId);

    let access: boolean =
      member.role === Role.MEMBER
        ? this.haveAccess(myMember, Role.ADMIN)
        : member.role === Role.ADMIN
          ? this.haveAccess(myMember, Role.SUPER_ADMIN)
          : false;

    if (!access) throw memberError.NO_ACCESS;

    await this.memberRepository.delete(memberId);
  }

  async leave(user: User, dto: LeaveDto) {
    return this.dataSource.transaction(async (entityManager) => {
      const memberRepository = entityManager.getRepository(Member);

      const member = await this.findMemberSafe(
        user.id,
        dto.memberId,
        memberRepository,
      );
      if (member.user.id !== user.id) throw memberError.NO_ACCESS;

      await memberRepository.delete(member.id);

      if (member.role === Role.SUPER_ADMIN) {
        const nextSuperAdminId = dto.nextSuperAdminId;
        if (nextSuperAdminId === undefined) throw memberError.SET_NEXT_ADMIN;
        await this.changeRole(
          nextSuperAdminId,
          Role.SUPER_ADMIN,
          true,
          this.memberRepository,
        );
      }
    });
  }

  haveAccess(member: Member, role: Role) {
    const memberRole = member.role;
    return ROLE_ACCESSES[memberRole] >= ROLE_ACCESSES[role];
  }
}
