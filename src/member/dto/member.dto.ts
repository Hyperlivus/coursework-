import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Role } from '../entity/member.entity';

export class MemberCreationDto {
  @IsInt()
  chatId: number;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
