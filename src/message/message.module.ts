import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entry/message.entry';
import { MemberModule } from '../member/member.module';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [TypeOrmModule.forFeature([Message]), MemberModule],
  exports: [MessageService],
})
export class MessageModule {}
