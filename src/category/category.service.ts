import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-product.dto';
import { randomUUID } from 'crypto';
import { Category } from './interfaces/category.interface';
import { CategoryRepository } from './repositories/category-repository';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(product: CreateCategoryDto): Promise<string> {
    const { description, name } = product;
    const createCategory: Category = {
      id: randomUUID(),
      name,
      description,
    };

    // await this..create(createProduct);

    return createCategory.id;
  }

  // async findAll(): Promise<Product[]> {
  //   return this.productRepository.findAll();
  // }

  // async findById(id: string): Promise<Product> {
  //   const product = await this.productRepository.findById(id);
  //   if (!product) {
  //     throw new NotFoundException(`Produto com ID ${id} não encontrado`);
  //   }
  //   return product;
  // }

  // async delete(id: string): Promise<void> {
  //   const product = await this.productRepository.findById(id);
  //   if (!product) {
  //     throw new NotFoundException(`Produto não encontrado`);
  //   }
  //   await this.productRepository.delete(id);
  // }

  // async update(product: UpdateProductDto): Promise<Product> {
  //   const productUpdating = await this.productRepository.findById(product.id);
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
  //   await this.productRepository.update(productUpdating);

  //   return productUpdating;
  // }
}
