import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<string> {
    const id = await this.categoriesService.create(category);
    const jsonString = JSON.stringify({ id });
    return jsonString;
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }

  @Patch()
  async update(@Body() updateCategory: UpdateCategoryDto): Promise<Category> {
    return this.categoriesService.update(updateCategory);
  }
}
