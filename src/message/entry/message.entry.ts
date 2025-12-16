import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/entity/member.entity';
import { Chat } from '../../chat/entity/chat.entry';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Member, (member) => member.messages, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  creator?: Member;

  @ManyToOne(() => Chat, (chat) => chat)
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
