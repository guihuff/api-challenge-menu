import { Product } from 'src/product/interfaces/product.interface';
import { ProductRepository } from '../product-repository';
import { Injectable } from '@nestjs/common';

global.product = [];

@Injectable()
export class ProductRepositoryImp implements ProductRepository {
  async create(product: Product): Promise<void> {
    global.product.push(product);
  }

  async findAll(): Promise<Product[]> {
    return global.product;
  }

  async findById(id: string): Promise<Product> {
    const product = global.product.find((object) => object.id === id);
    return product;
  }

  async delete(id: string): Promise<void> {
    const remove = global.product.findIndex((object) => object.id === id);
    if (remove === -1) {
      return;
    }
    global.product.splice(remove, 1);
  }

  async update(product: Product): Promise<Product> {
    const update = global.product.findIndex(
      (object) => object.id === product.id,
    );
    if (update === -1) {
      return;
    }
    global.product[update] = product;
  }
}
