import { Product } from '../interfaces/product.interface';

export abstract class ProductRepository {
  abstract create({
    id,
    name,
    price,
    image,
    description,
    id_category,
  }: Product): Promise<void>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product>;
  abstract delete(id: string): Promise<void>;
  abstract update(product: Product): Promise<Product>;
}
