import { SpinHistory } from 'src/spin-history/entities/spin-history.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @Column()
  color: string;
  @Column()
  catergoryId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => SpinHistory, (spinHistory) => spinHistory.item)
  spinHistory: SpinHistory[];
}
