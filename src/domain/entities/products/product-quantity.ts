import { Either, left, right } from '../../../shared';
import { MoreThanZeroError } from '../../errors';

export class ProductQuantity {
  private constructor(private readonly quantity: number) {
    Object.freeze(this);
  }

  get value(): number {
    return this.quantity;
  }

  static create(quantity: number): Either<MoreThanZeroError, ProductQuantity> {
    if (quantity <= 0) {
      return left(new MoreThanZeroError('quantity'))
    }

    return right(new ProductQuantity(quantity));
  }
}
