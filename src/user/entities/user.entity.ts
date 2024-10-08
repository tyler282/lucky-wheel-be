import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SpinHistory } from '../../spin-history/entities/spin-history.entity';
import { RedeemPointHistory } from '../../redeem-point-history/entities/redeem-point-history.entity';

@Entity()
export class User {
  // User entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true }) // nullable when user is guest
  password: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
  @Column({ default: 0 })
  totalPoints: number;
  @Column({ nullable: true })
  role: string; //admin, guest
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
