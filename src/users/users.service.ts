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
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const alreadyUser = await this.findOneByMobile(createUserDto.mobile, true);
    if (!alreadyUser) {
      const newUser: User = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } else {
      throw new BadRequestException(
        'کاربری با این شماره موبایل قبلا وارد سیستم شده است!',
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

  async findOne(id: number): Promise<User> {
    // return await this.userRepository.findOne({ where: { id: id } });
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException(`کاربر با آیدی ${id} یافت نشد!`);

    return user;
  }

  async findOneByMobile(mobile: string, checkExist: boolean = false) {
    // return await this.userRepository.findOne({ where: { id: id } });
    const user = await this.userRepository.findOneBy({ mobile });

    if (!checkExist)
      if (!user)
        throw new NotFoundException(
          `کاربر با شماره موبایل ${mobile} یافت نشد!`,
        );

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

  async addProductToBasket(user_id: number, product: Product) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: { basket_items: true },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    user.basket_items.push(product);

    return await this.userRepository.save(user);
  }

  async removeProductFromBasket(user_id: number, product_id: number) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: { basket_items: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prodctIndex = user.basket_items.findIndex(
      (item) => item.id === product_id,
    );

    if (prodctIndex === -1) {
      throw new NotFoundException('product not found in the basket');
    }

    // start from product index and delete one item
    user.basket_items.splice(prodctIndex, 1);

    return await this.userRepository.save(user);
  }
}
