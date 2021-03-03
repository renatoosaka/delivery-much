import { ProductData } from '../products';

export interface OrderData {
  id?: string;
  products: ProductData[];
  total?: number;
}
