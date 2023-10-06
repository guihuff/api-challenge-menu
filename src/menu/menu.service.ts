import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuRepository } from './repositories/menu-repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './interfaces/menu.interface';
import { randomUUID } from 'crypto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { $Enums } from '@prisma/client';
import { ResponseFindMenuDto } from './dto/response-find-menu-dto';

@Injectable()
export class MenuService {
  constructor(private menuRepository: MenuRepository) {}

  async create(menu: CreateMenuDto): Promise<string> {
    const { name, time, isActive, products } = menu;
    const createMenu: Menu = {
      id: randomUUID(),
      name,
      products,
      time,
      isActive,
    };

    await this.menuRepository.create(createMenu);

    return createMenu.id;
  }

  async findAll(): Promise<Menu[]> {
    return this.menuRepository.findAll();
  }

  async findById(id: string): Promise<Menu> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu com ID ${id} não encontrado`);
    }
    return menu;
  }

  async findByTime(): Promise<ResponseFindMenuDto> {
    const now = new Date().getHours();
    if (now >= 6) {
      if (now < 18) {
        const menu = await this.menuRepository.findByTime($Enums.TimeRole.DAY);
        return menu;
      }
      if (now >= 18) {
        const menu = await this.menuRepository.findByTime(
          $Enums.TimeRole.NIGHT,
        );
        return menu;
      }
    } else if (now < 6) {
      const menu = await this.menuRepository.findByTime($Enums.TimeRole.NIGHT);
      return menu;
    }
  }

  async delete(id: string): Promise<void> {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu não encontrado`);
    }
    await this.menuRepository.delete(id);
  }

  async update(menu: UpdateMenuDto): Promise<Menu> {
    const menuUpdating = await this.menuRepository.findById(menu.id);
    if (!menuUpdating) {
      throw new NotFoundException(`Menu não encontrado`);
    }

    if (menu.name) {
      menuUpdating.name = menu.name;
    }
    if (menu.isActive) {
      menuUpdating.isActive = menu.isActive;
    }
    if (menu.time) {
      menuUpdating.time = menu.time;
    }
    if (menu.products) {
      menuUpdating.products = menu.products;
    }
    console.log(menuUpdating.products);

    // await this.menuRepository.update(menuUpdating);

    return menuUpdating;
  }
}
