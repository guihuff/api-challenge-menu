import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductRepository } from './repositories/product-repository';
import { ProductRepositoryPrismaImp } from './repositories/database/product-repository-prisma-imp';
import { PrismaService } from '../database/prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetProductResponseDto } from './dtos/get-product-response.dto';
import { Product } from './interfaces/product.interface';
import { UpdateProductDto } from './dtos/update-product.dto';
import { validate } from 'class-validator';
import { Response } from 'express';
// import { UpdateProductDto } from './dtos/update-product.dto';
// import { GetProductResponseDto } from './dtos/get-product-response.dto';

const productTest: Product = {
  id: 'product-test-id',
  name: 'product-test-name',
  description: 'product-teste-desc',
  price: 99,
  id_category: 'category-id',
  image: 'image.jpg',
  imageURL: 'upload/image.jpg',
};

const file: Express.Multer.File = {
  fieldname: 'image',
  originalname: 'example.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: './upload/',
  filename: 'example.jpg',
  path: './upload/example.jpg',
  size: 12345,
  buffer: null,
  stream: null,
};
const updatedProductResponse: GetProductResponseDto = {
  id: 'teste-update-image',
  name: 'test-update-image-name',
  description: 'test-update-image-desc',
  price: 30,
  image: file.filename,
  imageURL: file.path,
  category: { id: 'category-id', name: 'category-name' },
};

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useClass: ProductRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'test create product',
        description: 'test create product description',
        price: 33,
        id_category: 'a category',
      };

      const id = 'some-generated-id';

      jest.spyOn(productService, 'create').mockResolvedValue(id);

      const result = await productController.create(createProductDto);

      expect(result).toEqual({ id });
    });

    it('should create a product but fail', async () => {
      const createProductDto: CreateProductDto = {
        name: 'test create product',
        description: 'test create product description',
        price: 33,
        id_category: 'a category',
      };

      jest
        .spyOn(productService, 'create')
        .mockRejectedValue(
          new InternalServerErrorException(
            'the product has not been registered',
          ),
        );

      await expect(
        productController.create(createProductDto),
      ).rejects.toThrowError('the product has not been registered');
    });

    it('should validate when name is empty', async () => {
      const dto = new CreateProductDto();
      dto.name = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should validate when price is empty', async () => {
      const dto = new CreateProductDto();
      dto.price = 0;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const mockProducts: GetProductResponseDto[] = [
        {
          id: productTest.id,
          name: productTest.name,
          category: { id: productTest.id_category, name: 'name-category-test' },
          price: productTest.price,
          description: productTest.description,
          image: productTest.image,
          imageURL: productTest.imageURL,
        },
      ];

      jest.spyOn(productService, 'findAll').mockResolvedValue(mockProducts);

      const result = await productController.findAll();

      expect(result).toEqual(mockProducts);
    });
  });

  describe('findById', () => {
    it('should return a product by ID', async () => {
      const mockProduct: GetProductResponseDto = {
        id: productTest.id,
        name: productTest.name,
        category: { id: productTest.id_category, name: 'name-category-test' },
        price: productTest.price,
        description: productTest.description,
        image: productTest.image,
        imageURL: productTest.imageURL,
      };
      const id = productTest.id;

      jest.spyOn(productService, 'findById').mockResolvedValue(mockProduct);

      const result = await productController.findById(id);

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product is not found by ID', async () => {
      const id = 'nonexistent-id';

      jest
        .spyOn(productService, 'findById')
        .mockRejectedValue(
          new NotFoundException(`product with ID ${id} not found`),
        );

      await expect(productController.findById(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  describe('delete', () => {
    it('should delete a product by ID', async () => {
      const id = productTest.id;

      jest.spyOn(productService, 'delete').mockResolvedValue();

      const result = await productController.delete(id);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when product is not found by ID', async () => {
      const id = 'nonexistent-id';

      jest
        .spyOn(productService, 'delete')
        .mockRejectedValue(
          new NotFoundException(`product with ID ${id} not found`),
        );

      await expect(productController.delete(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        id: productTest.id,
      };
      const updatedProduct: Product = productTest;

      jest.spyOn(productService, 'update').mockResolvedValue(updatedProduct);

      const result = await productController.update(updateProductDto);

      expect(result).toEqual(updatedProduct);
    });

    it('should validate when id is empty', async () => {
      const dto = new UpdateProductDto();
      dto.id = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should throw NotFoundException when product is not found by ID', async () => {
      const updateProductDto: UpdateProductDto = {
        id: productTest.id,
      };

      jest
        .spyOn(productService, 'update')
        .mockRejectedValue(new NotFoundException(`product not found`));

      await expect(
        productController.update(updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateImage', () => {
    it('should update product image', async () => {
      jest
        .spyOn(productService, 'updateImage')
        .mockResolvedValue(updatedProductResponse);

      const result = await productController.updateImage(
        updatedProductResponse.id,
        file,
      );

      expect(result).toEqual(updatedProductResponse);
    });

    it('should throw NotFoundException when product is not found by ID', async () => {
      jest
        .spyOn(productService, 'updateImage')
        .mockRejectedValue(new NotFoundException(`product not found`));

      await expect(
        productController.updateImage(updatedProductResponse.id, file),
      ).rejects.toThrowError(NotFoundException);
    });
  });
  describe('findProfileImage', () => {
    it('should send the image when it exists', async () => {
      const imagename = 'example.jpg';
      const response: Response = {
        sendFile: jest.fn(),
      } as unknown as Response;

      await productController.findProfileImage(imagename, response);

      expect(response.sendFile).toHaveBeenCalledWith(imagename, {
        root: './upload',
      });
    });
  });
});
