import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Role } from '../entity/member.entity';

export class CreateMemberDto {
  @IsInt()
  chatId: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class LeaveDto {
  @IsInt()
  memberId: number;

  @IsOptional()
  @IsInt()
  nextSuperAdminId?: number;
}

export class BanMemberDto {
  @IsInt()
  memberId: number;
}
