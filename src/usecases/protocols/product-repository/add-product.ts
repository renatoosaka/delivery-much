import { ProductData } from '../../../domain/entities/products';

export interface AddProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export interface AddProduct {
  add(data: AddProductDTO): Promise<ProductData>;
}
