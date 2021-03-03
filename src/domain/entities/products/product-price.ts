import { Either, left, right } from '../../../shared';
import { MoreThanZeroError } from '../../errors';

export class ProductPrice {
  private constructor(private readonly price: number) {
    Object.freeze(this);
  }

  get value(): number {
    return this.price;
  }

  static create(price: number): Either<MoreThanZeroError, ProductPrice> {
    if (price <= 0) {
      return left(new MoreThanZeroError('price'))
    }

    return right(new ProductPrice(price));
  }
}
