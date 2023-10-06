import { IsNotEmpty, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(5, 80)
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  id_category: string;
}
