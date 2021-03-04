import { RequiredFieldError } from '../errors';
import { Either, left, right } from '../../shared';
import { OrderData } from '../../domain/entities/orders';
import { ShowOrder } from '../protocols/show-order-protocol';
import { FindOrderById } from '../protocols/order-repository';

export class ShowOrderUseCase implements ShowOrder {
  constructor(private readonly findOrderById: FindOrderById) {}

  async show(
    id: string,
  ): Promise<Either<RequiredFieldError, OrderData | undefined>> {
    if (!id) {
      return left(new RequiredFieldError('id'));
    }

    const order = await this.findOrderById.find(id);
    return right(order);
  }
}
