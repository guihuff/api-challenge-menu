import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product-repository';
import { ProductRepositoryPrismaImp } from './repositories/database/product-repository-prisma-imp';
import { PrismaService } from 'src/database/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
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
