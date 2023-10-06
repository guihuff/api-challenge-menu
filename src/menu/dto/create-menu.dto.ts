import { IsEnum, IsNotEmpty } from 'class-validator';
import { TimeRole } from '../interfaces/menu.interface';

export class CreateMenuDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(TimeRole)
  time: TimeRole;

  @IsNotEmpty()
  isActive: boolean;

  products: string[];
}
