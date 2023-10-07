import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(5, 30)
  name: string;

  @IsNotEmpty()
  description: string;
}
