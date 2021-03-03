import { Either } from '../../shared';
import { ProductData } from '../../domain/entities/products';
import {
  MoreThanZeroError,
  RequiredValueError,
  ShortTextError,
} from '../../domain/errors';

export interface CreateProductDTO {
  name: string;
  price: number;
  quantity: number;
}

export type CreateProductResponse = Either<
  RequiredValueError | MoreThanZeroError | ShortTextError,
  ProductData
>;

export interface CreateProduct {
  create(data: CreateProductDTO): Promise<CreateProductResponse>;
}
