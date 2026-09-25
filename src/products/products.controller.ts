import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Response } from 'express';
import { BookmarkProductDto } from './dto/bookmark-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    const product = this.productsService.create(createProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'محصول با موفقیت ایجاد شد!',
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const products = await this.productsService.findAll();

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      messgae: 'محصولات با موفقیت یافت شدند!',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productsService.findOne(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: ' محصول با موفقیت یافت شد!',
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    const updateProduct = this.productsService.update(+id, updateProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateProduct,
      message: 'محصول مورد نظر با موفقیت بروزرسانی شد.',
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post('bookmark-product')
  async bookmarkProduct(
    @Body() bookmarkProduct: BookmarkProductDto,
    @Res() res: Response,
  ) {
    const bookmarkData = await this.productsService.taggleBookmark(
      +bookmarkProduct.user_id,
      +bookmarkProduct.product_id,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmarkData,
      message: 'محصول با موفقیت اضافه شد!',
    });
  }
}
