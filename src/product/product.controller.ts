import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private productsService: ProductService) {}

  @Post()
  async create(@Body() createProduct: CreateProductDto): Promise<string> {
    const id = await this.productsService.create(createProduct);
    const jsonString = JSON.stringify({ id });
    return jsonString;
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }

  @Put()
  async update(@Body() updateProduct: UpdateProductDto): Promise<Product> {
    return this.productsService.update(updateProduct);
  }
}
