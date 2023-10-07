export class GetProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  image: string;
  imageURL?: string;
}
