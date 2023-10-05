import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { randomUUID } from 'crypto';
import { Category } from './interfaces/category.interface';
import { CategoryRepository } from './repositories/category-repository';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(category: CreateCategoryDto): Promise<string> {
    const { description, name } = category;
    const createCategory: Category = {
      id: randomUUID(),
      name,
      description,
    };

    await this.categoryRepository.create(createCategory);

    return createCategory.id;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrado`);
    }
    return category;
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Categoria não encontrado`);
    }
    await this.categoryRepository.delete(id);
  }

  async update(category: UpdateCategoryDto): Promise<Category> {
    const categoryUpdating = await this.categoryRepository.findById(
      category.id,
    );
    if (!categoryUpdating) {
      throw new NotFoundException(`Produto não encontrado`);
    }
    const categoryAfter: Category = {
      id: category.id,
      name: category.name ? category.name : categoryUpdating.name,
      description: category.description
        ? category.description
        : categoryUpdating.description,
    };

    await this.categoryRepository.update(categoryAfter);

    return categoryAfter;
  }
}
