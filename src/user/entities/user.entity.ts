import { RedeemPointHistory } from 'src/redeem-point-history/entities/redeem-point-history.entity';
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
export class User {
  // User entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
  @Column()
  totalPoints: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // SpinHistory
  @OneToMany(() => SpinHistory, (spinHistory) => spinHistory.user)
  spinHistory: SpinHistory[];
  // RedeemPointHistory
  @OneToMany(
    () => RedeemPointHistory,
    (redeemPointHistory) => redeemPointHistory.user,
  )
  redeemPointHistory: RedeemPointHistory[];
}
