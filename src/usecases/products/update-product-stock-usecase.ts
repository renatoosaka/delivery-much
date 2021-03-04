import { left, right } from '../../shared';
import { ProductData } from '../../domain/entities/products';
import { ProductRepository } from '../protocols/product-repository';
import {
  UpdateProductStock,
  UpdateProductStockDTO,
  UpdateProductStockResponse,
} from '../protocols/update-product-stock-protocol';
import {
  ProductNotFoundError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../domain/errors';

export class UpdateProductStockUseCase implements UpdateProductStock {
  constructor(private readonly productRepository: ProductRepository) {}

  async update({
    name,
    quantity,
    operation,
  }: UpdateProductStockDTO): Promise<UpdateProductStockResponse> {
    if (!name) {
      return left(new RequiredValueError('name'));
    }

    if (!quantity) {
      return left(new RequiredValueError('quantity'));
    }

    if (!operation) {
      return left(new RequiredValueError('operation'));
    }

    if (quantity <= 0) {
      return left(new MoreThanZeroError('quantity'));
    }

    const product = await this.productRepository.find(name);

    if (!product) {
      return left(new ProductNotFoundError(name));
    }

    await this.productRepository.updateQuantity(
      product.id as string,
      quantity,
      operation,
    );

    const updated_product = await this.productRepository.find(name);

    return right(updated_product as ProductData);
  }
}
