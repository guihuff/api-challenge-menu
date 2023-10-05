import { Category } from 'src/category/interfaces/category.interface';
import { CategoryRepository } from '../category-repository';
import { Injectable } from '@nestjs/common';

global.category = [];

@Injectable()
export class CategoryRepositoryImp implements CategoryRepository {
  async create(category: Category): Promise<void> {
    global.category.push(category);
  }

  async findAll(): Promise<Category[]> {
    return global.category;
  }

  async findById(id: string): Promise<Category> {
    const category = global.category.find((object) => object.id === id);
    return category;
  }

  async delete(id: string): Promise<void> {
    const remove = global.category.findIndex((object) => object.id === id);
    if (remove === -1) {
      return;
    }
    global.category.splice(remove, 1);
  }

  async update(category: Category): Promise<Category> {
    const update = global.category.findIndex(
      (object) => object.id === category.id,
    );
    if (update === -1) {
      return;
    }
    global.category[update] = category;
  }
}
