import { Test, TestingModule } from '@nestjs/testing';
import { Menu } from './interfaces/menu.interface';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu-repository';
import { PrismaService } from '../database/prisma.service';
import { MenuRepositoryPrismaImp } from './repositories/database/menu-repository-prisma-imp';
import { CreateMenuDto } from './dto/create-menu.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import MockDate from 'mockdate';
import { UpdateMenuDto } from './dto/update-menu.dto';

describe('MenuService', () => {
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

  let menuServiceTest: MenuService;
  let menuRepositoryTest: MenuRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: MenuRepository,
          useClass: MenuRepositoryPrismaImp,
        },
        PrismaService,
      ],
    }).compile();

    menuServiceTest = module.get<MenuService>(MenuService);
    menuRepositoryTest = module.get<MenuRepository>(MenuRepository);
  });

  describe('create', () => {
    const createMenuNoProductDto: CreateMenuDto = {
      name: 'menu-create-test',
      time: 'DAY',
      isActive: true,
      products: [],
    };

    const createMenuDto: CreateMenuDto = {
      name: 'menu-create-test',
      time: 'DAY',
      isActive: true,
      products: [
        {
          id_product: 'product-valid',
        },
      ],
    };

    it('should create a menu and return the ID', async () => {
      jest.spyOn(menuRepositoryTest, 'create').mockResolvedValue();

      const menuId = await menuServiceTest.create(createMenuDto);

      expect(menuId).toBeDefined();
    });

    it('should create a menu but fail', async () => {
      jest
        .spyOn(menuRepositoryTest, 'create')
        .mockRejectedValue(
          new InternalServerErrorException('the menu has not been registered'),
        );

      await expect(
        menuServiceTest.create(createMenuNoProductDto),
      ).rejects.toThrowError('the menu has not been registered');
    });

    it('should generate a valid UUID when creating a menu', async () => {
      jest.spyOn(menuRepositoryTest, 'create').mockResolvedValue();

      const menuId = await menuServiceTest.create(createMenuDto);

      expect(menuId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of menus when menus exist', async () => {
      const mockCategories: Menu[] = [menu, menu];

      jest
        .spyOn(menuRepositoryTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await menuServiceTest.findAll();

      expect(result).toEqual(expect.arrayContaining(mockCategories));
    });

    it('should return an empty list when no menus exist', async () => {
      const mockCategories: Menu[] = [];

      jest
        .spyOn(menuRepositoryTest, 'findAll')
        .mockResolvedValue(mockCategories);

      const result = await menuServiceTest.findAll();

      expect(result).toEqual(expect.arrayContaining([]));
    });

    it('should handle database error', async () => {
      jest
        .spyOn(menuRepositoryTest, 'findAll')
        .mockRejectedValue(new Error('Database error'));

      await expect(menuServiceTest.findAll()).rejects.toThrowError(Error);
    });
  });

  describe('findById', () => {
    it('should return a menu when a menu with the specified ID exists', async () => {
      const menuID = 'existent-id';
      const mockMenu: Menu = menu;
      mockMenu.id = menuID;

      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(mockMenu);

      const result = await menuServiceTest.findById(menuID);

      expect(result).toEqual(mockMenu);
    });

    it('should throw NotFoundException when a menu with the specified ID does not exist', async () => {
      const menuID = 'nonexistent-id';

      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(menuServiceTest.findById(menuID)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const menuID = 'existent-id';

      jest
        .spyOn(menuRepositoryTest, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await expect(menuServiceTest.findById(menuID)).rejects.toThrowError(
        Error,
      );
    });
  });

  describe('findByTime', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the day menu during daytime (6am to 5:59pm)', async () => {
      const expectedTime: $Enums.TimeRole = 'DAY';
      MockDate.set('2023-01-01T10:00:00.000Z');

      jest
        .spyOn(menuRepositoryTest, 'findByTime')
        .mockImplementation(async (time: $Enums.TimeRole) => {
          return {
            time,
            products: [],
            id: menu.id,
            name: menu.name,
            isActive: true,
          };
        });

      const result = await menuServiceTest.findByTime();

      expect(result.time).toEqual(expectedTime);
    });
  });

  it('should return the night menu during nighttime (6pm to 5:59am)', async () => {
    const expectedTime: $Enums.TimeRole = 'NIGHT';
    MockDate.set('2023-01-01T22:00:00.000Z');

    jest
      .spyOn(menuRepositoryTest, 'findByTime')
      .mockImplementation(async (time: $Enums.TimeRole) => {
        return {
          time,
          products: [],
          id: menu.id,
          name: menu.name,
          isActive: true,
        };
      });

    const result = await menuServiceTest.findByTime();

    expect(result.time).toEqual(expectedTime);
  });

  it('should handle database error', async () => {
    MockDate.set('2023-01-01T22:00:00.000Z');

    jest
      .spyOn(menuRepositoryTest, 'findByTime')
      .mockRejectedValue(new Error('Database error'));

    await expect(menuServiceTest.findByTime).rejects.toThrowError(Error);
  });

  describe('delete', () => {
    it('should delete a menu when a menu with the specified ID exists', async () => {
      const menuID = 'existent-id';

      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(menu);
      jest.spyOn(menuRepositoryTest, 'delete').mockResolvedValue();

      await menuServiceTest.delete(menuID);

      expect(menuRepositoryTest.delete).toHaveBeenCalledWith(menuID);
    });

    it('should throw NotFoundException when a menu with the specified ID does not exist', async () => {
      const menuID = 'nonexistent-id';

      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(menuServiceTest.delete(menuID)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle database error', async () => {
      const menuID = 'existent-id';

      jest
        .spyOn(menuRepositoryTest, 'delete')
        .mockRejectedValue(new Error('Database error'));

      await expect(menuServiceTest.delete(menuID)).rejects.toThrowError(Error);
    });
  });

  describe('update', () => {
    it('shuld menu update succeful', async () => {
      const updatemenuDto: UpdateMenuDto = {
        id: menu.id,
        name: 'name updating menu',
      };
      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(menu);
      jest.spyOn(menuRepositoryTest, 'update').mockResolvedValue({
        ...menu,
        name: updatemenuDto.name,
      });

      const response = await menuServiceTest.update(updatemenuDto);

      expect(updatemenuDto.name).toBe(response.name);
    });

    it('should throw NotFoundException when a menu with the specified ID does not exist', async () => {
      const menuID = 'nonexistent-id';
      const updateProductDto: UpdateMenuDto = {
        id: menuID,
      };

      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(null);

      await expect(
        menuServiceTest.update(updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle database error', async () => {
      const menuID = 'existent-id';
      const updateProductDto: UpdateMenuDto = {
        id: menuID,
      };
      jest.spyOn(menuRepositoryTest, 'findById').mockResolvedValue(menu);

      jest
        .spyOn(menuRepositoryTest, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        menuServiceTest.update(updateProductDto),
      ).rejects.toThrowError(Error);
    });
  });
});
