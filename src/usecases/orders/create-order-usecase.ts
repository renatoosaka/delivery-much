import { Order } from '../../domain/entities/orders';
import { ProductData } from '../../domain/entities/products';
import { ProductNotFoundError } from '../../domain/errors/product-notfound-error';
import { left, right } from '../../shared';
import {
  CreateOrder,
  CreateOrderDTO,
  CreateOrderResponse,
} from '../protocols/create-order-protocol';
import { AddOrder } from '../protocols/order-repository';
import { FindProductByName } from '../protocols/product-repository';

export class CreateOrderUseCase implements CreateOrder {
  constructor(
    private readonly findProduct: FindProductByName,
    private readonly addOrder: AddOrder,
  ) {}

  async create(data: CreateOrderDTO): Promise<CreateOrderResponse> {
    const { products } = data;

    const founded_products: ProductData[] = [];

    for await (const product of products) {
      const found = await this.findProduct.find(product.name);

      if (!found) {
        return left(new ProductNotFoundError(product.name));
      }

      founded_products.push({ ...product, price: found.price, id: found.id });
    }

    const orderOrError = Order.create({ products: founded_products });

    if (orderOrError.isLeft()) {
      return left(orderOrError.value);
    }

    const order_created = await this.addOrder.add({
      products: founded_products.map(product => ({
        id: product.id as string,
        price: product.price,
        quantity: product.quantity,
      })),
    });

    return right(order_created);
  }
}
