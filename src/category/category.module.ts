import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category-repository';
import { CategoryRepositoryPrismaImp } from './repositories/database/category-repository-prisma-imp';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryPrismaImp,
    },
    PrismaService,
  ],
})
export class CategoryModule {}
