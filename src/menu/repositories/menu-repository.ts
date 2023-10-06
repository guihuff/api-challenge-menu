import { $Enums } from '@prisma/client';
import { Menu } from '../interfaces/menu.interface';
import { ResponseFindMenuDto } from '../dto/response-find-menu-dto';

export abstract class MenuRepository {
  abstract create(menu: Menu): Promise<void>;
  abstract findAll(): Promise<Menu[]>;
  abstract findById(id: string): Promise<Menu>;
  abstract findByTime(time: $Enums.TimeRole): Promise<ResponseFindMenuDto>;
  abstract delete(id: string): Promise<void>;
  abstract update(menu: Menu): Promise<Menu>;
}
