import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({ message: 'آیدی کاربر نمیتواند خالی باشد.' })
  user_id!: number;

  @IsString({ message: 'موضوع باید یک رشته باشد' })
  @IsNotEmpty({ message: 'موضوع نمیتواند خالی باشد' })
  subject!: string;

  @IsString({ message: 'عنوان باید یک رشته باشد' })
  @IsNotEmpty({ message: 'عنوان نمیتواند خالی باشد' })
  title!: string;

  @IsNotEmpty({ message: 'توضیحات نمیتواند خالی باشد' })
  @IsString({ message: 'توضیحات باید یک رشته باشد.' })
  description!: string;

  @IsOptional()
  reply_to!: number;
}
