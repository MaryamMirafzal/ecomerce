import { IsEnum, IsInt, IsOptional } from 'class-validator';
import OrderStatusEnum from '../enums/order-status.enum';

export class CreateOrderDto {
  @IsInt()
  user_id!: number;

  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @IsOptional()
  set_time?: Date;

  @IsOptional()
  payed_time?: Date;

  @IsInt()
  address_id!: number;

  @IsInt()
  total_price!: number;

  @IsInt()
  @IsOptional()
  discount_code?: number;
}
