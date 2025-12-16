import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../../member/entity/member.entity';
import { Message } from '../../message/entry/message.entry';
import { ReactionType } from './reaction-type.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member)
  creator: Member;

  @ManyToOne(() => Message)
  message: Message;

  @ManyToOne(() => ReactionType)
  type: ReactionType;
}
