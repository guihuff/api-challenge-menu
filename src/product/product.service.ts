import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ProductRepository } from './repositories/product-repository';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductResponseDto } from './dtos/get-product-response.dto';
import { HelperFile } from 'src/helpers/file.helper';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(product: CreateProductDto): Promise<string> {
    const { description, id_category, name, price } = product;
    const createProduct: Product = {
      id: randomUUID(),
      name,
      price,
      description,
      id_category,
      image: null,
      imageURL: null,
    };

    await this.productRepository.create(createProduct);
    return createProduct.id;
  }

  async findAll(): Promise<GetProductResponseDto[]> {
    return this.productRepository.findAll();
  }

  async findById(id: string): Promise<GetProductResponseDto> {
    const product = await this.productRepository.findByIdWithCategory(id);
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return product;
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto não encontrado`);
    }
    await this.productRepository.delete(id);
  }

  async update(product: UpdateProductDto): Promise<Product> {
    const productUpdating = await this.productRepository.findById(product.id);
    if (!productUpdating) {
      throw new NotFoundException(`Produto não encontrado`);
    }

    if (product.name) {
      productUpdating.name = product.name;
    }
    if (product.description) {
      productUpdating.description = product.description;
    }
    if (product.price) {
      productUpdating.price = product.price;
    }
    if (product.id_category) {
      productUpdating.id_category = product.id_category;
    }

    await this.productRepository.update(productUpdating);

    return productUpdating;
  }

  async updateImage(
    id: string,
    fileName: string,
    file: string,
  ): Promise<GetProductResponseDto> {
    const productUpdating = await this.productRepository.findById(id);
    if (!productUpdating) {
      throw new NotFoundException(`Produto não encontrado`);
    }
    console.log(productUpdating);
    if (productUpdating.image === null || productUpdating.image === '') {
      await this.productRepository.updateImage(id, fileName, file);
    } else {
      await HelperFile.removeFile(productUpdating.imageURL);
      await this.productRepository.updateImage(id, fileName, file);
    }

    const product = await this.productRepository.findByIdWithCategory(id);

    return product;
  }
}
