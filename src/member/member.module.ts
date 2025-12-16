import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';

@Module({
  providers: [MemberService],
  controllers: [MemberController],
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [MemberService],
})
export class MemberModule {}
