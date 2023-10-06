import { Menu, TimeRole } from '../interfaces/menu.interface';

export abstract class MenuRepository {
  abstract create(menu: Menu): Promise<void>;
  abstract findAll(): Promise<Menu[]>;
  abstract findById(id: string): Promise<Menu>;
  abstract findByTime(time: TimeRole): Promise<Menu>;
  abstract delete(id: string): Promise<void>;
  abstract update(menu: Menu): Promise<Menu>;
}
