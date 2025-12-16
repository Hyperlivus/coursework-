import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from '../../chat/entity/chat.entry';
import { User } from '../../user/entry/user.entry';
import { Message } from '../../message/entry/message.entry';

export enum Role {
  MEMBER = 'member',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat)
  chat: Chat;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => Message, (message) => message.creator)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
