import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';

export class UpdateUserDto {
  @IsString({ message: 'نام باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'نام نمی تواند خالی باشد' })
  display_name!: string;

  @IsEnum(UserRoleEnum, {
    message: 'وضعیت پروژه نامعتبر است باید یکی از مقادیر admin یا user باشد',
  })
  role!: UserRoleEnum;
}
