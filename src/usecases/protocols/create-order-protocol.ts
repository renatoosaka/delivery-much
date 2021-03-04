import { Either } from '../../shared';
import { OrderQuantityError } from '../errors';
import { OrderData } from '../../domain/entities/orders';
import { ProductNotFoundError } from '../../domain/errors/product-notfound-error';
import {
  DuplicatedProductsError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../domain/errors';

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
  | ProductNotFoundError
  | OrderQuantityError,
  OrderData
>;

export interface CreateOrder {
  create(data: CreateOrderDTO): Promise<CreateOrderResponse>;
}
