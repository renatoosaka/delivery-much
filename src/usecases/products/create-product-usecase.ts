import { left, right } from '../../shared';
import { Product } from '../../domain/entities/products';
import { AddProduct } from '../protocols/product-repository';
import {
  CreateProduct,
  CreateProductDTO,
  CreateProductResponse,
} from '../protocols/create-product-protocols';

export class CreateProductUseCase implements CreateProduct {
  constructor(private readonly addProduct: AddProduct) {}

  async create(data: CreateProductDTO): Promise<CreateProductResponse> {
    const { name, price, quantity } = data;

    const productOrError = Product.create({
      name,
      price,
      quantity,
    });

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    const product_created = await this.addProduct.add({
      name,
      price,
      quantity,
    });

    return right(product_created);
  }
}
