import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { TimeRole } from '../interfaces/menu.interface';

export class CreateMenuDto {
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @IsNotEmpty()
  @IsEnum(TimeRole)
  time: TimeRole;

  @IsNotEmpty()
  isActive: boolean;

  products: string[];
}
