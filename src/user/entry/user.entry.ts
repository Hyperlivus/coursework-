import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface UserCreationAttributes {
  email: string;
  tag: string;
  nickname: string;
  password: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  nickname: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', length: 96, unique: true })
  tag: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  password: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text' })
  bio?: string;
}
