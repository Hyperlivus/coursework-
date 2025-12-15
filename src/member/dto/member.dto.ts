import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Role } from '../entity/member.entity';

export class MemberCreationDto {
  @IsInt()
  chatId: number;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
