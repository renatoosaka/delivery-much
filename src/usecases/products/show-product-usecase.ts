import { Either, left, right } from '../../shared';
import { ProductData } from '../../domain/entities/products';
import { ShowProduct } from '../protocols/show-product-protocol';
import { FindProductByName } from '../protocols/product-repository';
import { RequiredFieldError } from '../errors';

export class ShowProductUseCase implements ShowProduct {
  constructor(private readonly findProductByName: FindProductByName) {}

  async show(
    name: string,
  ): Promise<Either<RequiredFieldError, ProductData | undefined>> {
    if (!name) {
      return left(new RequiredFieldError('name'));
    }

    const product = await this.findProductByName.find(name);

    return right(product);
  }
}
