import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-product.dto';
import { randomUUID } from 'crypto';
import { Category } from './interfaces/category.interface';
import { CategoryRepository } from './repositories/category-repository';

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

  // async findById(id: string): Promise<Product> {
  //   const product = await this.categoryRepository.findById(id);
  //   if (!product) {
  //     throw new NotFoundException(`Produto com ID ${id} não encontrado`);
  //   }
  //   return product;
  // }

  // async delete(id: string): Promise<void> {
  //   const product = await this.categoryRepository.findById(id);
  //   if (!product) {
  //     throw new NotFoundException(`Produto não encontrado`);
  //   }
  //   await this.categoryRepository.delete(id);
  // }

  // async update(product: UpdateProductDto): Promise<Product> {
  //   const productUpdating = await this.categoryRepository.findById(product.id);
  //   if (!productUpdating) {
  //     throw new NotFoundException(`Produto não encontrado`);
  //   }
  //   if (product.name) {
  //     productUpdating.name = product.name;
  //   }
  //   if (product.description) {
  //     productUpdating.description = product.description;
  //   }
  //   if (product.price) {
  //     productUpdating.price = product.price;
  //   }
  //   if (product.id_category) {
  //     productUpdating.id_category = product.id_category;
  //   }
  //   if (product.image) {
  //     productUpdating.image = product.image;
  //   }
  //   await this.categoryRepository.update(productUpdating);

  //   return productUpdating;
  // }
}
