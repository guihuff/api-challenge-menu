import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu-repository';
import { MenuRepositoryPrismaImp } from './repositories/database/menu-repository-prisma-imp';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './interfaces/menu.interface';
import { UpdateMenuDto } from './dto/update-menu.dto';

describe('MenuController', () => {
  let menuControllerTest: MenuController;
  let menuServiceTest: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        MenuService,
        {
          provide: MenuRepository,
          useClass: MenuRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    menuControllerTest = module.get<MenuController>(MenuController);
    menuServiceTest = module.get<MenuService>(MenuService);
  });

  const menu: Menu = {
    id: 'id-valid',
    name: 'menu test',
    time: 'DAY',
    isActive: true,
    products: [
      {
        id_product: 'id-product-valid',
      },
    ],
  };

  it('should be defined', () => {
    expect(menuControllerTest).toBeDefined();
    expect(menuServiceTest).toBeDefined();
  });

  describe('create', () => {
    const createMenuDto: CreateMenuDto = {
      name: 'test create menu',
      time: 'DAY',
      isActive: true,
      products: [
        {
          id_product: 'id-product-valid',
        },
      ],
    };

    it('should create a menu', async () => {
      const id = 'some-generated-id';

      jest.spyOn(menuServiceTest, 'create').mockResolvedValue(id);

      const result = await menuControllerTest.create(createMenuDto);

      expect(result).toEqual({ id });
    });

    it('should create a menu but fail', async () => {
      jest
        .spyOn(menuServiceTest, 'create')
        .mockRejectedValue(
          new InternalServerErrorException('the menu has not been registered'),
        );

      await expect(
        menuControllerTest.create(createMenuDto),
      ).rejects.toThrowError('the menu has not been registered');
    });

    it('should validate when name is empty', async () => {
      const dto = new CreateMenuDto();
      dto.name = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('findAll', () => {
    it('should return a list of menus when menus exist', async () => {
      const mockMenu: Menu[] = [menu, menu];

      jest.spyOn(menuServiceTest, 'findAll').mockResolvedValue(mockMenu);

      const result = await menuControllerTest.findAll();

      expect(result).toEqual(mockMenu);
    });

    it('should return an empty list when no menus exist', async () => {
      const mockMenu: Menu[] = [];

      jest.spyOn(menuServiceTest, 'findAll').mockResolvedValue(mockMenu);

      const result = await menuControllerTest.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      jest
        .spyOn(menuServiceTest, 'findAll')
        .mockRejectedValue(new NotFoundException('Database error'));

      await expect(menuControllerTest.findAll()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return a menu when a menu with the specified ID exists', async () => {
      const menuID = 'existent-id';

      const mockMenu: Menu = {
        id: menuID,
        name: 'Menu test',
        ...menu,
      };

      jest.spyOn(menuServiceTest, 'findById').mockResolvedValue(mockMenu);

      const result = await menuControllerTest.findById(menuID);

      expect(result).toEqual(mockMenu);
    });

    it('should throw NotFoundException when a menuIDith the specified ID does not exist', async () => {
      const menuID = 'nonexistent-id';
      jest
        .spyOn(menuServiceTest, 'findById')
        .mockRejectedValue(
          new NotFoundException(`menu with ID ${menuID} not found`),
        );

      await expect(menuControllerTest.findById(menuID)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const menuID = 'existent-id';
      jest
        .spyOn(menuServiceTest, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await expect(menuControllerTest.findById(menuID)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('delete', () => {
    it('should delete a menu when a menu with the specified ID exists', async () => {
      const menuId = 'existent-id';
      jest.spyOn(menuServiceTest, 'delete').mockResolvedValue();

      await menuControllerTest.delete(menuId);

      const result = await menuControllerTest.delete(menuId);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when a menu with the specified ID does not exist', async () => {
      const menuId = 'nonexistent-id';
      jest
        .spyOn(menuServiceTest, 'delete')
        .mockRejectedValue(new NotFoundException(`menu not found`));

      await expect(menuControllerTest.delete(menuId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const menuId = 'existent-id';
      jest
        .spyOn(menuServiceTest, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(menuControllerTest.delete(menuId)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const updateMenuDto: UpdateMenuDto = {
        id: menu.id,
        name: 'new name',
      };

      jest.spyOn(menuServiceTest, 'update').mockResolvedValue({
        ...menu,
        name: updateMenuDto.name,
      });

      const result = await menuControllerTest.update(updateMenuDto);

      expect(result.name).not.toEqual(menu.name);
    });

    it('should validate when id is empty', async () => {
      const dto = new UpdateMenuDto();
      dto.id = '';

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should throw NotFoundException when category is not found by ID', async () => {
      const updateCategory: UpdateMenuDto = {
        id: 'invalid-id',
      };

      jest
        .spyOn(menuServiceTest, 'update')
        .mockRejectedValue(new NotFoundException(`menu not found`));

      await expect(
        menuControllerTest.update(updateCategory),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
