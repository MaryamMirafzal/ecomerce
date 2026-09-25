import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class BookmarkProductDto {
  @IsNotEmpty({ message: 'شناسه محصول الزامی است.' })
  @IsNumber({}, { message: 'شناسه محصول باید یک عدد معتبر باشد.' })
  product_id!: number;

  @IsNotEmpty({ message: 'شناسه کاربر الزامی است.' })
  @IsNumber({}, { message: 'شناسه کاربر باید یک عدد معتبر باشد.' })
  @IsInt({ message: 'شناسه کاربر باید یک عددصحیح باشد' })
  user_id!: number;
}
