import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import UserRoleEnum from './enums/userRoleEnum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `هنگام ایجاد کاربر جدید خطایی رخ داد: ${error}`,
      );
    }
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('user');

    if (role) {
      query.where('role = :role', { role });
    }

    query.skip((page - 1) * limit).take(limit);
    return await query.getMany();
  }

  async findOne(id: number) {
    // return await this.userRepository.findOne({ where: { id: id } });
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`کاربر با آیدی ${id} یافت نشد!****`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        display_name: updateUserDto.display_name,
        role: updateUserDto.role,
      });
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(`خطا در بروزرسانی: ${error}`);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected == 0)
      throw new NotFoundException(`کاربر با آیدی ${id} یافت نشد!`);
  }
}
