import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  id: string;

  name?: string;
  description?: string;
}
