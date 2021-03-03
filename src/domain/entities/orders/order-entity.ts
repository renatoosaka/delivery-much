import { Either, left, right } from '../../../shared';
import {
  DuplicatedProductsError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../errors';
import { ProductData } from '../products';
import { OrderData } from './order-data';

export class Order {
  private constructor(private readonly products: ProductData[]) {
    Object.freeze(this);
  }

  static create(
    data: OrderData,
  ): Either<
    RequiredValueError | MoreThanZeroError | DuplicatedProductsError,
    Order
  > {
    const { products } = data;

    if (products.length <= 0) {
      return left(new RequiredValueError('products'));
    }

    for (const product of products) {
      if (product.quantity <= 0) {
        return left(new MoreThanZeroError('quantity'));
      }

      if (product.price <= 0) {
        return left(new MoreThanZeroError('price'));
      }
    }

    const all = products.map(product => product.name);
    const unique = new Set(all);

    if (unique.size !== all.length) {
      return left(new DuplicatedProductsError());
    }

    return right(new Order(products));
  }
}
