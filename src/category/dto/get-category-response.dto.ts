export class GetCategoryResponseDto {
  id: string;
  name: string;
  description: string;
  products: ProductResponseDto[];
}

class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  imageURL?: string;
}
