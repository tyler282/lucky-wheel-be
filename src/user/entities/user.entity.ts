import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
