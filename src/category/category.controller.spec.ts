import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

import { PrismaService } from '../database/prisma.service';
import { CategoryRepository } from './repositories/category-repository';
import { CategoryRepositoryPrismaImp } from './repositories/database/category-repository-prisma-imp';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { Category } from './interfaces/category.interface';
import { GetCategoryResponseDto } from './dto/get-category-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoryController', () => {
  let categoryControllerTest: CategoryController;
  let categoryServiceTest: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useClass: CategoryRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    categoryControllerTest = module.get<CategoryController>(CategoryController);
    categoryServiceTest = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(categoryControllerTest).toBeDefined();
    expect(categoryServiceTest).toBeDefined();
  });

  describe('create', () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'test create category',
      description: 'test create category description',
    };

    it('should create a category', async () => {
      const id = 'some-generated-id';

      jest.spyOn(categoryServiceTest, 'create').mockResolvedValue(id);

      const result = await categoryControllerTest.create(createCategoryDto);

      expect(result).toEqual({ id });
    });

    it('should create a category but fail', async () => {
      jest
        .spyOn(categoryServiceTest, 'create')
        .mockRejectedValue(
          new InternalServerErrorException(
            'the category has not been registered',
          ),
        );

      await expect(
        categoryControllerTest.create(createCategoryDto),
      ).rejects.toThrowError('the category has not been registered');
    });

    it('should validate when name is empty', async () => {
      const dto = new CreateCategoryDto();
      dto.name = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('findAll', () => {
    it('should return a list of categories when categories exist', async () => {
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'category 1',
          description: 'category-test description',
        },
        {
          id: '2',
          name: 'category 2',
          description: 'category-test description',
        },
      ];

      jest
        .spyOn(categoryServiceTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await categoryControllerTest.findAll();

      expect(result).toEqual(mockCategories);
    });

    it('should return an empty list when no categories exist', async () => {
      const mockCategories: Category[] = [];

      jest
        .spyOn(categoryServiceTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await categoryControllerTest.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      jest
        .spyOn(categoryServiceTest, 'findAll')
        .mockRejectedValue(new NotFoundException('Database error'));

      await expect(categoryControllerTest.findAll()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return a category when a category with the specified ID exists', async () => {
      const categoryId = 'existent-id';

      const mockCategory: GetCategoryResponseDto = {
        id: categoryId,
        name: 'Category test',
        description: 'description category',
        products: [],
      };

      jest
        .spyOn(categoryServiceTest, 'findCategoryWithProducts')
        .mockResolvedValue(mockCategory);

      const result = await categoryControllerTest.findById(categoryId);

      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when a category with the specified ID does not exist', async () => {
      const categoryId = 'nonexistent-id';
      jest
        .spyOn(categoryServiceTest, 'findCategoryWithProducts')
        .mockRejectedValue(
          new NotFoundException(`category with ID ${categoryId} not found`),
        );

      await expect(
        categoryControllerTest.findById(categoryId),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const categoryId = 'existent-id';
      jest
        .spyOn(categoryServiceTest, 'findCategoryWithProducts')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        categoryControllerTest.findById(categoryId),
      ).rejects.toThrowError(Error);
    });
  });

  describe('delete', () => {
    it('should delete a category when a category with the specified ID exists', async () => {
      const categoryId = 'existent-id';
      jest.spyOn(categoryServiceTest, 'delete').mockResolvedValue();

      await categoryControllerTest.delete(categoryId);

      const result = await categoryControllerTest.delete(categoryId);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when a category with the specified ID does not exist', async () => {
      const categoryId = 'nonexistent-id';
      jest
        .spyOn(categoryServiceTest, 'delete')
        .mockRejectedValue(new NotFoundException(`category not found`));

      await expect(
        categoryControllerTest.delete(categoryId),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const categoryId = 'existent-id';
      jest
        .spyOn(categoryServiceTest, 'delete')
        .mockRejectedValue(new Error('Database error'));

      // Verifique se a função lança uma exceção ao encontrar um erro
      await expect(
        categoryControllerTest.delete(categoryId),
      ).rejects.toThrowError(Error);
    });
  });

  describe('update', () => {
    const category: Category = {
      id: 'id-valid',
      name: 'name',
      description: 'description',
    };

    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        id: category.id,
        name: 'new name',
      };

      jest.spyOn(categoryServiceTest, 'update').mockResolvedValue({
        ...category,
        name: updateCategoryDto.name,
      });

      const result = await categoryControllerTest.update(updateCategoryDto);

      expect(result.name).not.toEqual(category.name);
    });

    it('should validate when id is empty', async () => {
      const dto = new UpdateCategoryDto();
      dto.id = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should throw NotFoundException when category is not found by ID', async () => {
      const updateCategory: UpdateCategoryDto = {
        id: 'invalid-id',
      };

      jest
        .spyOn(categoryServiceTest, 'update')
        .mockRejectedValue(new NotFoundException(`product not found`));

      await expect(
        categoryControllerTest.update(updateCategory),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
