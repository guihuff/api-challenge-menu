import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-product.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<string> {
    const id = await this.categoriesService.create(category);
    const jsonString = JSON.stringify({ id });
    return jsonString;
  }

  //   @Get()
  //   async findAll(): Promise<Product[]> {
  //     return this.productsService.findAll();
  //   }

  //   @Get(':id')
  //   async findById(@Param('id') id: string): Promise<Product> {
  //     return this.productsService.findById(id);
  //   }

  //   @Delete(':id')
  //   @HttpCode(204)
  //   async delete(@Param('id') id: string): Promise<void> {
  //     return this.productsService.delete(id);
  //   }

  //   @Put()
  //   async update(@Body() updateProduct: UpdateProductDto): Promise<Product> {
  //     return this.productsService.update(updateProduct);
  //   }
}
