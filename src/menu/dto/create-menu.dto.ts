import { TimeRole } from '../interfaces/menu.interface';

export class CreateMenuDto {
  name: string;
  time: TimeRole;
  isActive: boolean;
  products: string[];
}
