import { Category } from '../interfaces/category.interface';

export abstract class CategoryRepository {
  abstract create({ id, name, description }: Category): Promise<void>;
  abstract findAll(): Promise<Category[]>;
  abstract findById(id: string): Promise<Category>;
  abstract delete(id: string): Promise<void>;
  abstract update(product: Category): Promise<Category>;
}
