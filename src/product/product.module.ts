import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product-repository';
import { ProductRepositoryImp } from './repositories/database/product-repository-imp';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImp,
    },
  ],
})
export class ProductModule {}
