import { Product } from '../../interfaces/product.interface';
import { ProductRepository } from '../product-repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { GetProductResponseDto } from '../../dtos/get-product-response.dto';

@Injectable()
export class ProductRepositoryPrismaImp implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    await this.prisma.product
      .create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          id_category: product.id_category,
          image: product.image,
          imageURL: product.imageURL,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'the product has not been registered',
        );
      });
  }

  async findAll(): Promise<GetProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        price: true,
        image: true,
        imageURL: true,
      },
    });
    return products;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        id_category: true,
        imageURL: true,
      },
    });
    return product;
  }

  async findByIdWithCategory(id: string): Promise<GetProductResponseDto> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        price: true,
        image: true,
        imageURL: true,
      },
    });
    return product;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async update(product: Product): Promise<GetProductResponseDto> {
    const productAfterUpdate = await this.prisma.product.update({
      where: {
        id: product.id,
      },
      data: { ...product },
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        price: true,
        image: true,
        imageURL: true,
      },
    });
    return productAfterUpdate;
  }

  async updateImage(
    id: string,
    fileName: string,
    path: string,
  ): Promise<GetProductResponseDto> {
    const productAfterUpdate = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        image: fileName,
        imageURL: path,
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        price: true,
        image: true,
        imageURL: true,
      },
    });
    return productAfterUpdate;
  }
}
