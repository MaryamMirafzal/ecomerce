import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import OrderStatusEnum from '../enums/order-status.enum';
import { Address } from 'src/address/entities/address.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status!: OrderStatusEnum;

  @Column({ type: 'timestamp', nullable: true })
  set_time!: Date;

  @Column({ type: 'timestamp', nullable: true })
  payed_time!: Date;

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @Column({ type: 'bigint' })
  total_price!: number;

  @Column({ type: 'varchar', nullable: true })
  discount_code!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
