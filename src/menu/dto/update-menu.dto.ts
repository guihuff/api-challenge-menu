import { TimeRole } from '../interfaces/menu.interface';

export class UpdateMenuDto {
  id: string;
  name?: string;
  time?: TimeRole;
  isActive?: boolean;
  products?: string[];
}
