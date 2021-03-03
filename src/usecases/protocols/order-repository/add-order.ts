import { OrderData } from '../../../domain/entities/orders';

export interface ProductToAdd {
  id: string;
  price: number;
  quantity: number;
}

export interface AddOrderDTO {
  products: ProductToAdd[];
}

export interface AddOrder {
  add(data: AddOrderDTO): Promise<OrderData>;
}
