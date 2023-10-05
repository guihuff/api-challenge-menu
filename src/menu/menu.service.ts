import { Injectable } from '@nestjs/common';
import { MenuRepository } from './repositories/menu-repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './interfaces/menu.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class MenuService {
  constructor(private menuRepository: MenuRepository) {}
  async create(menu: CreateMenuDto): Promise<string> {
    const { name, timeInit, timeEnd, isActive, products } = menu;
    const createMenu: Menu = {
      id: randomUUID(),
      name,
      products,
      timeInit,
      timeEnd,
      isActive,
    };

    await this.menuRepository.create(createMenu);

    return createMenu.id;
  }
}
