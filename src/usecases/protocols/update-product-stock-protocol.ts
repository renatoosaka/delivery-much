import { Either } from '../../shared';
import { ProductData } from '../../domain/entities/products';
import {
  ProductNotFoundError,
  RequiredValueError,
  MoreThanZeroError,
} from '../../domain/errors';

type OperationType = 'increase' | 'decrease';

export interface UpdateProductStockDTO {
  name: string;
  quantity: number;
  operation: OperationType;
}

export type UpdateProductStockResponse = Either<
  ProductNotFoundError | RequiredValueError | MoreThanZeroError,
  ProductData
>;

export interface UpdateProductStock {
  update(data: UpdateProductStockDTO): Promise<UpdateProductStockResponse>;
}
