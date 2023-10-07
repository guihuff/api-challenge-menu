import { $Enums } from '@prisma/client';

export class ResponseFindMenuDto {
  id: string;
  name: string;
  time: $Enums.TimeRole;
  isActive: boolean;
  products: { product: ResponseProductMenuDto }[];
}

class ResponseProductMenuDto {
  id: string;
  name: string;
  description: string;
  category: ResponseCategoryMenuDto;
  image: string;
  price: number;
}

class ResponseCategoryMenuDto {
  id: string;
  name: string;
  description: string;
}
