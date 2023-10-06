import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../category-repository';
import { Category } from 'src/category/interfaces/category.interface';
import { PrismaService } from 'src/database/prisma.service';

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
