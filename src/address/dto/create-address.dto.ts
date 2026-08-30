import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'آیدی کاربر نمیتواند خالی باشد.' })
  user_id!: number;

  @IsString({ message: 'استان باید یک رشته باشد' })
  @IsNotEmpty({ message: 'استان نمیتواند خالی باشد' })
  province!: string;

  @IsString({ message: 'شهر باید یک رشته باشد' })
  @IsNotEmpty({ message: 'شهر نمیتواند خالی باشد' })
  city!: string;

  @IsString({ message: 'کد پستی یک رشته است' })
  @Length(10, 10, { message: 'کد پستی باید 10 رقم باشد.' })
  postal_code!: string;

  @IsString({ message: 'آدرس باید یک رشته باشد' })
  @IsNotEmpty({ message: 'آدرس نمیتواند خالی باشد' })
  address!: string;

  @IsString({ message: 'شماره موبایل یک رشته است' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  reciver_mobile!: string;

  @IsOptional()
  @IsString({ message: 'توضیحات باید یک رشته باشد.' })
  description!: string;
}
