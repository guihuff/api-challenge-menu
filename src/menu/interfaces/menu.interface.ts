import { $Enums } from '@prisma/client';

export interface Menu {
  id: string;
  name: string;
  time: $Enums.TimeRole;
  isActive: boolean;
  products: { id_product: string }[];
}
