import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionType } from './entity/reaction-type.entity';
import { Reaction } from './entity/reaction.entity';
import { MemberModule } from '../member/member.module';
import { MessageModule } from '../message/message.module';

@Module({
  providers: [ReactionService],
  controllers: [ReactionController],
  imports: [
    TypeOrmModule.forFeature([Reaction, ReactionType]),
    MemberModule,
    MessageModule,
  ],
})
export class ReactionModule {}
