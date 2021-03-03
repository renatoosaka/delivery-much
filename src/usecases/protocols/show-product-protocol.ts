import { Either } from '../../shared';
import { ProductData } from '../../domain/entities/products';
import { RequiredFieldError } from '../errors';

export interface ShowProduct {
  show(
    name: string,
  ): Promise<Either<RequiredFieldError, ProductData | undefined>>;
}
