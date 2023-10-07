import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product-repository';
import { ProductRepositoryPrismaImp } from './repositories/database/product-repository-prisma-imp';
import { PrismaService } from '../database/prisma.service';
import { Product } from './interfaces/product.interface';
import { CreateProductDto } from './dtos/create-product.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetProductResponseDto } from './dtos/get-product-response.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { HelperFile } from '../helpers/file.helper';

const productTest: Product = {
  id: 'product-test-id',
  name: 'product-test-name',
  description: 'product-teste-desc',
  price: 99,
  id_category: 'category-id',
  image: 'image.jpg',
  imageURL: 'upload/image.jpg',
};

const createProductDto: CreateProductDto = {
  name: 'test create product',
  description: 'test create product description',
  price: 33,
  id_category: 'a category',
};

describe('ProductService', () => {
  let productServiceTest: ProductService;
  let productRepositoryTest: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useClass: ProductRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    productServiceTest = module.get<ProductService>(ProductService);
    productRepositoryTest = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    it('should create a product and return the ID', async () => {
      jest.spyOn(productRepositoryTest, 'create').mockResolvedValue();

      const createdProductId =
        await productServiceTest.create(createProductDto);

      expect(createdProductId).toBeDefined();
    });

    it('should create a product but fail', async () => {
      jest
        .spyOn(productRepositoryTest, 'create')
        .mockRejectedValue(
          new InternalServerErrorException(
            'the product has not been registered',
          ),
        );

      await expect(
        productServiceTest.create(createProductDto),
      ).rejects.toThrowError('the product has not been registered');
    });

    it('should generate a valid UUID when creating a product', async () => {
      jest.spyOn(productRepositoryTest, 'create').mockResolvedValue();

      const createdProductId =
        await productServiceTest.create(createProductDto);

      expect(createdProductId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of products when products exist', async () => {
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

      jest
        .spyOn(productRepositoryTest, 'findAll')
        .mockResolvedValue(mockProducts);

      const result = await productServiceTest.findAll();

      expect(result).toEqual(expect.arrayContaining(mockProducts));
    });

    it('should return an empty list when no products exist', async () => {
      const mockProducts: GetProductResponseDto[] = [];

      jest
        .spyOn(productRepositoryTest, 'findAll')
        .mockResolvedValue(mockProducts);

      const result = await productServiceTest.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      jest
        .spyOn(productRepositoryTest, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(productServiceTest.findAll()).rejects.toThrowError(Error);
    });
  });

  describe('findById', () => {
    it('should return a product when a product with the specified ID exists', async () => {
      const productId = 'existent-id';
      const mockProduct: GetProductResponseDto = {
        id: productId,
        name: 'Product 1',
        description: 'Description 1',
        price: 10.0,
        category: {
          id: '1',
          name: 'Category 1',
        },
        image: 'imagem.jpg',
      };
      jest
        .spyOn(productRepositoryTest, 'findByIdWithCategory')
        .mockResolvedValue(mockProduct);

      const result = await productServiceTest.findById(productId);

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when a product with the specified ID does not exist', async () => {
      const productId = 'nonexistent-id';

      jest
        .spyOn(productRepositoryTest, 'findByIdWithCategory')
        .mockResolvedValue(null);

      await expect(productServiceTest.findById(productId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const productId = 'existent-id';

      jest
        .spyOn(productRepositoryTest, 'findByIdWithCategory')
        .mockRejectedValue(new Error('Database error'));

      await expect(productServiceTest.findById(productId)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('delete', () => {
    it('should delete a product when a product with the specified ID exists', async () => {
      const productId = 'existent-id';

      jest
        .spyOn(productRepositoryTest, 'findById')
        .mockResolvedValue(productTest);
      jest.spyOn(productRepositoryTest, 'delete').mockResolvedValue();

      await productServiceTest.delete(productId);

      expect(productRepositoryTest.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when a product with the specified ID does not exist', async () => {
      const productId = 'nonexistent-id';

      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(productServiceTest.delete(productId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const productId = 'existent-id';

      jest
        .spyOn(productRepositoryTest, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(productServiceTest.delete(productId)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('update', () => {
    it('shuld product update succeful', async () => {
      const product = productTest;
      const updateProductDto: UpdateProductDto = {
        id: product.id,
        name: 'name updating',
      };
      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(product);
      jest.spyOn(productRepositoryTest, 'update').mockResolvedValue({
        id: product.id,
        name: updateProductDto.name,
        description: product.description,
        price: product.price,
        category: {
          id: '1',
          name: 'Category 1',
        },
        image: product.image,
      });

      const response = await productServiceTest.update(updateProductDto);

      expect(updateProductDto.name).toBe(response.name);
    });

    it('should throw NotFoundException when a product with the specified ID does not exist', async () => {
      const productId = 'nonexistent-id';
      const updateProductDto: UpdateProductDto = {
        id: productId,
      };

      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(
        productServiceTest.update(updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const productId = 'existent-id';
      const updateProductDto: UpdateProductDto = {
        id: productId,
      };
      jest
        .spyOn(productRepositoryTest, 'findById')
        .mockResolvedValue(productTest);

      jest
        .spyOn(productRepositoryTest, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        productServiceTest.update(updateProductDto),
      ).rejects.toThrowError(Error);
    });
  });

  describe('updateImage', () => {
    const product = productTest;
    const fileName = 'new-image.jpg';
    const path = 'upload/new-image.jpg';

    const productResponse: GetProductResponseDto = {
      id: product.id,
      name: product.name,
      category: { id: product.id_category, name: 'name-category-test' },
      price: product.price,
      description: product.description,
      image: fileName,
      imageURL: path,
    };
    it('should update image successfully when product exists and has no previous image', async () => {
      product.image = null;
      product.imageURL = null;
      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(product);

      jest
        .spyOn(productRepositoryTest, 'updateImage')
        .mockResolvedValue(productResponse);

      jest
        .spyOn(productRepositoryTest, 'findByIdWithCategory')
        .mockResolvedValue(productResponse);

      const result = await productServiceTest.updateImage(
        product.id,
        fileName,
        path,
      );

      expect(result).toBeDefined();
      expect(result.image).not.toBeNull();
    });

    it('should update image successfully when product exists and has a previous image', async () => {
      product.image = 'before-image';
      product.imageURL = 'before-image';

      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(product);

      jest.spyOn(HelperFile, 'removeFile').mockResolvedValue(true);
      jest
        .spyOn(productRepositoryTest, 'updateImage')
        .mockResolvedValue(productResponse);
      jest
        .spyOn(productRepositoryTest, 'findByIdWithCategory')
        .mockResolvedValue(productResponse);

      const result = await productServiceTest.updateImage(
        product.id,
        fileName,
        path,
      );

      expect(result).toBeDefined();
      expect(result.image).not.toBeNull();
      expect(result.image).toEqual(fileName);
    });

    it('should throw NotFoundException when product does not exist', async () => {
      // Mock para simular que o produto não existe
      jest.spyOn(productRepositoryTest, 'findById').mockResolvedValue(null);

      // Verifique se a função lança uma NotFoundException
      await expect(
        productServiceTest.updateImage('nonexistent-id', fileName, path),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
