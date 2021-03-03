import { Either } from '../../shared';
import { OrderData } from '../../domain/entities/orders';
import {
  DuplicatedProductsError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../domain/errors';
import { ProductNotFoundError } from '../../domain/errors/product-notfound-error';

export interface ProductOrder {
  name: string;
  quantity: number;
}

export interface CreateOrderDTO {
  products: ProductOrder[];
}

export type CreateOrderResponse = Either<
  | RequiredValueError
  | MoreThanZeroError
  | DuplicatedProductsError
  | ProductNotFoundError,
  OrderData
>;

export interface CreateOrder {
  create(data: CreateOrderDTO): Promise<CreateOrderResponse>;
}
