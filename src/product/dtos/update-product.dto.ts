import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  id: string;
  name?: string;
  description?: string;
  price?: number;
  id_category?: string;
  image?: string;
}
