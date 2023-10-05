import { Menu } from 'src/menu/interfaces/menu.interface';
import { MenuRepository } from '../menu-repository';
import { Injectable } from '@nestjs/common';

global.menu = [];

@Injectable()
export class MenuRepositoryImp implements MenuRepository {
  async create(menu: Menu): Promise<void> {
    global.menu.push(menu);
  }

  async findAll(): Promise<Menu[]> {
    return global.menu;
  }

  async findById(id: string): Promise<Menu> {
    const menu = global.menu.find((object) => object.id === id);
    return menu;
  }

  async delete(id: string): Promise<void> {
    const remove = global.menu.findIndex((object) => object.id === id);
    if (remove === -1) {
      return;
    }
    global.menu.splice(remove, 1);
  }

  async update(menu: Menu): Promise<Menu> {
    const update = global.menu.findIndex((object) => object.id === menu.id);
    if (update === -1) {
      return;
    }
    global.menu[update] = menu;
  }
}
