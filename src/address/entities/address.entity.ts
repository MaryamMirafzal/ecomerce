import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/browser';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  province!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  address!: string;

  @Column({ length: 10 })
  postal_code!: string;

  @Column({ length: 11 })
  reciver_mobile!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
