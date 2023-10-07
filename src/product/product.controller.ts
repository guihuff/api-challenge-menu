import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  HttpCode,
  Patch,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './interfaces/product.interface';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductResponseDto } from './dtos/get-product-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFile } from '../helpers/file.helper';
import { Response } from 'express';

@Controller('products')
export class ProductController {
  constructor(private productsService: ProductService) {}

  @Post()
  async create(
    @Body() createProduct: CreateProductDto,
  ): Promise<{ id: string }> {
    const id = await this.productsService.create(createProduct);
    return { id };
  }

  @Get()
  async findAll(): Promise<GetProductResponseDto[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<GetProductResponseDto> {
    return this.productsService.findById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }

  @Patch()
  async update(@Body() updateProduct: UpdateProductDto): Promise<Product> {
    return this.productsService.update(updateProduct);
  }

  @Patch('/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload/',
        filename: HelperFile.customFilename,
      }),
    }),
  )
  async updateImage(
    @Body('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GetProductResponseDto> {
    return this.productsService.updateImage(id, file.filename, file.path);
  }

  @Get('image/:imagename')
  async findProfileImage(
    @Param('imagename') imagename: string,
    @Res() res: Response,
  ) {
    return res.sendFile(imagename, {
      root: './upload',
    });
  }
}
