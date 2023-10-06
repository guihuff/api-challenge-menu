import { $Enums } from '@prisma/client';
import { Menu } from '../interfaces/menu.interface';

export abstract class MenuRepository {
  abstract create(menu: Menu): Promise<void>;
  abstract addProduct(
    menu: string,
    products: { id_product: string }[],
  ): Promise<{ count: number }>;
  abstract findAll(): Promise<Menu[]>;
  abstract findById(id: string): Promise<Menu>;
  abstract findByTime(time: $Enums.TimeRole): Promise<Menu>;
  abstract delete(id: string): Promise<void>;
  abstract update(menu: Menu): Promise<Menu>;
}
