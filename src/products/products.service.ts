import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { BookmarkProduct } from './entities/bookmark-product.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(BookmarkProduct)
    private readonly bookmarkProductRepostitory: Repository<BookmarkProduct>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly userService: UsersService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { title, price, description, stock, categoryIds } = createProductDto;

    const product = this.productRepository.create({
      title,
      price,
      description,
      stock,
    });

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: { categories: true },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { categories: true },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد!');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { title, price, description, stock, categoryIds } = updateProductDto;

    const product = await this.findOne(id);

    if (title) product.title = title;
    if (price) product.price = price;
    if (description) product.description = description;
    if (stock) product.stock = stock;

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });

      product.categories = categories;
    }

    return await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async taggleBookmark(
    user_id: number,
    product_id: number,
  ): Promise<BookmarkProduct | void> {
    const user = await this.userService.findOne(user_id);
    const product = await this.productRepository.findOne({
      where: { id: product_id },
    });

    if (!user || !product) {
      throw new Error('کاربر یا محصول یافت نشد!');
    }

    const existingBookmark = await this.bookmarkProductRepostitory.findOne({
      where: { user: { id: user_id }, product: { id: product_id } },
    });

    if (existingBookmark) {
      await this.bookmarkProductRepostitory.remove(existingBookmark);
    } else {
      const newBookmark = this.bookmarkProductRepostitory.create({
        user: user,
        product: product,
      });
      return await this.bookmarkProductRepostitory.save(newBookmark);
    }
  }
}
