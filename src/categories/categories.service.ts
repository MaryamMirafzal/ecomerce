import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({
      relations: { products: true },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { products: true },
    });

    if (!category)
      throw new NotFoundException(`Category with ${id} not found!`);

    return category;
  }

  async removeOnlyCategory(id: string): Promise<void> {
    const category: Category = await this.findOne(+id);

    // delete product related
    category.products = [];
    await this.categoryRepository.save(category);

    // delete category
    await this.categoryRepository.remove(category);
  }

  async safeRemove(id: number): Promise<void> {
    const category: Category = await this.findOne(+id);

    if (category.products.length > 0)
      throw new BadRequestException('this category have a more product');

    await this.categoryRepository.remove(category);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.productRepository.remove(category.products);
    await this.categoryRepository.remove(category);
  }
}
