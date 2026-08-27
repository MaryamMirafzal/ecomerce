import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'موبایل باید یک رشته باشد.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  // @Matches(/^.{11}$/, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'موبایل نمی تواند خالی باشد' })
  mobile!: string;

  @IsString({ message: 'نام باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'نام نمی تواند خالی باشد' })
  display_name!: string;

  @IsString({ message: 'رمز عبور رشته است.' })
  @IsOptional()
  @MinLength(8, { message: 'رمز عبور حداقل 8 کاراکتر است.' })
  password!: string;

  @IsEnum(UserRoleEnum, {
    message: 'وضعیت پروژه نامعتبر است باید یکی از مقادیر admin یا user باشد',
  })
  role!: UserRoleEnum;
}
