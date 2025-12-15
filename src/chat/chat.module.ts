import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './entity/chat.entry';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from '../member/member.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [TypeOrmModule.forFeature([Chat]), MemberModule],
})
export class ChatModule {}
