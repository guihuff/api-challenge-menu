import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product-repository';
import { ProductRepositoryPrismaImp } from './repositories/database/product-repository-prisma-imp';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductRepositoryPrismaImp,
    },
    PrismaService,
  ],
})
export class ProductModule {}
