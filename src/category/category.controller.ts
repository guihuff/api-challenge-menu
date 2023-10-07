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
import { GetCategoryResponseDto } from './dto/get-category-response.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<{ id: string }> {
    const id = await this.categoriesService.create(category);
    return { id };
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GetCategoryResponseDto> {
    return this.categoriesService.findCategoryWithProducts(id);
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
