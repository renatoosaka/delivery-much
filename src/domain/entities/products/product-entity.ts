import { Either, left, right } from '../../../shared';
import { MoreThanZeroError, RequiredValueError } from '../../errors';
import { ProductData } from './product-data';
import { ProductName } from './product-name';
import { ProductPrice } from './product-price';
import { ProductQuantity } from './product-quantity';

export class Product {
  private constructor(
    private readonly name: ProductName,
    private readonly price: ProductPrice,
    private readonly quantity: ProductQuantity,
  ) {
    Object.freeze(this);
  }

  static create(
    data: ProductData,
  ): Either<RequiredValueError | MoreThanZeroError, Product> {
    const { name, quantity, price } = data;

    const nameOrError = ProductName.create(name);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    const quantityOrError = ProductQuantity.create(quantity);

    if (quantityOrError.isLeft()) {
      return left(quantityOrError.value);
    }

    const priceOrError = ProductPrice.create(price);

    if (priceOrError.isLeft()) {
      return left(priceOrError.value);
    }

    return right(
      new Product(nameOrError.value, priceOrError.value, quantityOrError.value),
    );
  }
}
