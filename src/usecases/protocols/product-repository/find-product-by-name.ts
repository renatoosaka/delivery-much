import { ProductData } from '../../../domain/entities/products';

export interface FindProductByName {
  find(name: string): Promise<ProductData | undefined>;
}
