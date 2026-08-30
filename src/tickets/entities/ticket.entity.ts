import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.tickets)
  user!: User;

  @Column()
  title!: string;

  @Column()
  subject!: string;

  @Column()
  description!: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.replies, { nullable: true })
  reply_to!: Ticket;

  @OneToMany(() => Ticket, (ticket) => ticket.reply_to)
  replies!: Ticket[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
