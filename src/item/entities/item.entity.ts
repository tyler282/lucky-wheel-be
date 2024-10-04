import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpinHistory } from '../../spin-history/entities/spin-history.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  img: string;
  @Column()
  value: number;
  @Column({ default: 1 })
  weight: number;
  @Column()
  color: string;
  @Column()
  categoryId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => SpinHistory, (spinHistory) => spinHistory.item)
  spinHistory: SpinHistory[];
}
