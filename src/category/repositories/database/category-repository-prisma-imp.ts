import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../category-repository';
import { Category } from '../../interfaces/category.interface';
import { PrismaService } from '../../../database/prisma.service';
import { GetCategoryResponseDto } from '../../dto/get-category-response.dto';

@Injectable()
export class CategoryRepositoryPrismaImp implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create({ id, name, description }: Category): Promise<void> {
    await this.prisma.category.create({
      data: {
        id,
        name,
        description,
      },
    });
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return categories;
  }

  async findById(id: string): Promise<Category> {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return category;
  }

  async findCategoryWithProducts(id: string): Promise<GetCategoryResponseDto> {
    const category = await this.prisma.category.findFirstOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        id_category: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        imageURL: true,
      },
    });

    const categoryProducts: GetCategoryResponseDto = {
      id: category.id,
      name: category.name,
      description: category.description,
      products,
    };

    return categoryProducts;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
  async update(category: Category): Promise<Category> {
    const categoryAfterUpdate = await this.prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        name: category.name,
        description: category.description,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
    return categoryAfterUpdate;
  }
}
