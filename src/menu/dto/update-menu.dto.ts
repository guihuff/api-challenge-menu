import { IsEnum, IsNotEmpty } from 'class-validator';
import { TimeRole } from '../interfaces/menu.interface';

export class UpdateMenuDto {
  @IsNotEmpty()
  id: string;
  name?: string;

  @IsEnum(TimeRole)
  time?: TimeRole;

  isActive?: boolean;
  products?: string[];
}
