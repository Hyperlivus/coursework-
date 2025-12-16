import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReactionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'varchar', length: 255 })
  iconUrl: string;
}
