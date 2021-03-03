import { Either, left, right } from '../../../shared';
import { ShortTextError } from '../../errors';
import { RequiredValueError } from '../../errors/required-value-error';

export class ProductName {
  private constructor(private readonly name: string) {
    Object.freeze(this);
  }

  get value(): string {
    return this.name;
  }

  static create(
    name: string,
  ): Either<RequiredValueError | ShortTextError, ProductName> {
    if (!name) {
      return left(new RequiredValueError('name'));
    }

    if (name.length <= 3) {
      return left(new ShortTextError('name', 3));
    }

    return right(new ProductName(name));
  }
}
