import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString({ message: 'موبایل باید یک رشته باشد.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  mobile!: string;

  @IsString({ message: 'رمز عبور رشته است.' })
  @IsNotEmpty({ message: 'رمزعبور نمی تواند خالی باشد' })
  // @MinLength(8, { message: 'رمز عبور حداقل 8 کاراکتر است.' })
  @MaxLength(16, { message: 'رمز عبور حداکثر 16 کاراکتر است.' })
  password!: string;
}
