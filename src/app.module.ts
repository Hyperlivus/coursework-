import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { User } from './user/entry/user.entry';
import { Chat } from './chat/entity/chat.entry';
import { MemberModule } from './member/member.module';
import { Member } from './member/entity/member.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/entry/message.entry';
import { ReactionModule } from './reaction/reaction.module';
import { Reaction } from './reaction/entity/reaction.entity';
import { ReactionType } from './reaction/entity/reaction-type.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      host: process.env.DB_HOST,
      type: 'postgres',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [User, Chat, Member, Message, Reaction, ReactionType],
    }),
    ChatModule,
    MemberModule,
    MessageModule,
    ReactionModule,
  ],
})
export class AppModule {}
