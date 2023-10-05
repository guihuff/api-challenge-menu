import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category-repository';
import { CategoryRepositoryImp } from './repositories/database/category-repository-imp';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImp,
    },
  ],
})
export class CategoryModule {}
