import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @Length(1, 30)
  name: string;

  @IsNotEmpty()
  @IsEnum($Enums.TimeRole)
  time: $Enums.TimeRole;

  @IsNotEmpty()
  isActive: boolean;

  products: { id_product: string }[];
}
