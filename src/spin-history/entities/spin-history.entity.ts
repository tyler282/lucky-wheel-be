import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class SpinHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  itemId: number;
  @Column()
  value: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToOne(() => User, (user) => user.spinHistory)
  user: User;
  @OneToOne(() => User, (item) => item.spinHistory)
  item: Item;
}
