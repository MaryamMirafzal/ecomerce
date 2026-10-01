import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import OrderStatusEnum from '../enums/order-status.enum';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNumber(
    {},
    {
      message: 'آیدی کاربر باید یک عدد صحیح باشد.',
    },
  )
  user_id!: number;

  @IsEnum(OrderStatusEnum, {
    message: 'وضعیت سفارش معتبر نیست.',
  })
  @IsOptional()
  status?: OrderStatusEnum;

  @IsOptional()
  payed_time?: Date;

  @IsInt({
    message: 'آیدی آدرس باید یک عدد صحیح باشد.',
  })
  address_id!: number;

  @IsNumber(
    {},
    {
      message: 'قیمت کل سفارش باید یک عدد باشد.',
    },
  )
  total_price!: number;

  @IsInt({
    message: 'کد تخفیف باید یک عدد صحیح باشد.',
  })
  @IsOptional()
  discount_code?: number;

  @IsArray({ message: 'آیتم های سفارش باید به صورت آرایه ارسال شوند.' })
  @ValidateNested({ each: true, message: 'هر آیتم سفارش باید معتبر باشد.' })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
