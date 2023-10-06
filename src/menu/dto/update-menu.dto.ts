import { IsEnum, IsNotEmpty } from 'class-validator';
import { $Enums } from '@prisma/client';

export class UpdateMenuDto {
  @IsNotEmpty()
  id: string;
  name?: string;

  @IsEnum($Enums.TimeRole)
  time?: $Enums.TimeRole;

  isActive?: boolean;
  products?: { id_product: string }[];
}
