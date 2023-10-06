import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuRepository } from './repositories/menu-repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu, TimeRole } from './interfaces/menu.interface';
import { randomUUID } from 'crypto';

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

  async findByTime(): Promise<Menu> {
    const now = new Date().getHours();
    if (now >= 6) {
      if (now < 18) {
        const menu = await this.menuRepository.findByTime(TimeRole.day);
        return menu;
      }
      if (now >= 18) {
        const menu = await this.menuRepository.findByTime(TimeRole.night);
        return menu;
      }
    } else if (now < 6) {
      const menu = await this.menuRepository.findByTime(TimeRole.night);
      return menu;
    }
  }
}
