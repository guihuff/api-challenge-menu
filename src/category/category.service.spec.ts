import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repositories/category-repository';
import { CategoryRepositoryPrismaImp } from './repositories/database/category-repository-prisma-imp';
import { PrismaService } from '../database/prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './interfaces/category.interface';
import { GetCategoryResponseDto } from './dto/get-category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryService', () => {
  const categoryTest: Category = {
    id: 'valid-id',
    name: 'name category',
    description: 'description category',
  };

  let categoryServiceTest: CategoryService;
  let categoryRepositoryTest: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useClass: CategoryRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    categoryServiceTest = module.get<CategoryService>(CategoryService);
    categoryRepositoryTest = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'category-create-test',
      description: 'new category-description',
    };

    it('should create a category and return the ID', async () => {
      jest.spyOn(categoryRepositoryTest, 'create').mockResolvedValue();

      const categoryId = await categoryServiceTest.create(createCategoryDto);

      expect(categoryId).toBeDefined();
    });

    it('should create a category but fail', async () => {
      jest
        .spyOn(categoryRepositoryTest, 'create')
        .mockRejectedValue(
          new InternalServerErrorException(
            'the category has not been registered',
          ),
        );

      await expect(
        categoryServiceTest.create(createCategoryDto),
      ).rejects.toThrowError('the category has not been registered');
    });

    it('should generate a valid UUID when creating a category', async () => {
      jest.spyOn(categoryRepositoryTest, 'create').mockResolvedValue();

      const categoryId = await categoryServiceTest.create(createCategoryDto);

      expect(categoryId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of categorys when categories exist', async () => {
      const mockCategories: Category[] = [
        {
          id: categoryTest.id,
          name: categoryTest.name,
          description: categoryTest.description,
        },
        {
          id: categoryTest.id,
          name: categoryTest.name,
          description: categoryTest.description,
        },
      ];

      jest
        .spyOn(categoryRepositoryTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await categoryServiceTest.findAll();

      expect(result).toEqual(expect.arrayContaining(mockCategories));
    });

    it('should return an empty list when no categories exist', async () => {
      const mockCategories: Category[] = [];

      jest
        .spyOn(categoryRepositoryTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await categoryServiceTest.findAll();

      expect(result).toEqual(expect.arrayContaining([]));
    });

    it('should handle database error', async () => {
      jest
        .spyOn(categoryRepositoryTest, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(categoryServiceTest.findAll()).rejects.toThrowError(Error);
    });
  });

  describe('findById', () => {
    it('should return a category when a category with the specified ID exists', async () => {
      const categoryId = 'existent-id';
      const mockCategory: Category = {
        id: categoryId,
        name: categoryTest.name,
        description: categoryTest.description,
      };
      jest
        .spyOn(categoryRepositoryTest, 'findById')
        .mockResolvedValue(mockCategory);

      const result = await categoryServiceTest.findById(categoryId);

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when a category with the specified ID does not exist', async () => {
      const categoryID = 'nonexistent-id';

      jest.spyOn(categoryRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(
        categoryServiceTest.findById(categoryID),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const categoryID = 'existent-id';

      jest
        .spyOn(categoryRepositoryTest, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        categoryServiceTest.findById(categoryID),
      ).rejects.toThrowError(Error);
    });
  });

  describe('findCategoryWithProducts', () => {
    it('should return a product when a category with the specified ID exists', async () => {
      const categoryId = 'existent-id';
      const mockCategory: GetCategoryResponseDto = {
        id: categoryId,
        name: categoryTest.name,
        description: categoryTest.description,
        products: [
          {
            id: 'test-product',
            name: 'test-product',
            description: 'test-product',
            price: 99,
            image: 'test-product',
            imageURL: 'test-product',
          },
        ],
      };
      jest
        .spyOn(categoryRepositoryTest, 'findCategoryWithProducts')
        .mockResolvedValue(mockCategory);

      const result =
        await categoryServiceTest.findCategoryWithProducts(categoryId);

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when a product with the specified ID does not exist', async () => {
      const categoryID = 'nonexistent-id';

      jest
        .spyOn(categoryRepositoryTest, 'findCategoryWithProducts')
        .mockResolvedValue(null);

      await expect(
        categoryServiceTest.findCategoryWithProducts(categoryID),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const categoryID = 'existent-id';

      jest
        .spyOn(categoryRepositoryTest, 'findCategoryWithProducts')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        categoryServiceTest.findCategoryWithProducts(categoryID),
      ).rejects.toThrowError(Error);
    });
  });

  describe('delete', () => {
    it('should delete a category when a category with the specified ID exists', async () => {
      const categoryID = 'existent-id';

      jest
        .spyOn(categoryRepositoryTest, 'findById')
        .mockResolvedValue(categoryTest);
      jest.spyOn(categoryRepositoryTest, 'delete').mockResolvedValue();

      await categoryServiceTest.delete(categoryID);

      expect(categoryRepositoryTest.delete).toHaveBeenCalledWith(categoryID);
    });

    it('should throw NotFoundException when a category with the specified ID does not exist', async () => {
      const categoryID = 'nonexistent-id';

      jest.spyOn(categoryRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(categoryServiceTest.delete(categoryID)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const categoryID = 'existent-id';

      jest
        .spyOn(categoryRepositoryTest, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(categoryServiceTest.delete(categoryID)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('update', () => {
    it('shuld category update succeful', async () => {
      const category = categoryTest;
      const updateCategoryDto: UpdateCategoryDto = {
        id: category.id,
        name: 'name updating',
      };
      jest
        .spyOn(categoryRepositoryTest, 'findById')
        .mockResolvedValue(category);
      jest.spyOn(categoryRepositoryTest, 'update').mockResolvedValue({
        id: category.id,
        name: updateCategoryDto.name,
        description: category.description,
      });

      const response = await categoryServiceTest.update(updateCategoryDto);

      expect(updateCategoryDto.name).toBe(response.name);
    });

    it('should throw NotFoundException when a category with the specified ID does not exist', async () => {
      const categoryID = 'nonexistent-id';
      const updateProductDto: UpdateCategoryDto = {
        id: categoryID,
      };

      jest.spyOn(categoryRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(
        categoryServiceTest.update(updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const categoryID = 'existent-id';
      const updateProductDto: UpdateCategoryDto = {
        id: categoryID,
      };
      jest
        .spyOn(categoryRepositoryTest, 'findById')
        .mockResolvedValue(categoryTest);

      jest
        .spyOn(categoryRepositoryTest, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        categoryServiceTest.update(updateProductDto),
      ).rejects.toThrowError(Error);
    });
  });
});
