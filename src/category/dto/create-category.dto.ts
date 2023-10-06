import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(5, 25)
  name: string;

  @IsNotEmpty()
  description: string;
}
