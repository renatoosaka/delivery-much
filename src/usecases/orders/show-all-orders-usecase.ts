import { OrderData } from '../../domain/entities/orders';
import { AllOrders } from '../protocols/order-repository';
import { ShowAllOrders } from '../protocols/show-all-order-protocol';

export class ShowAllOrdersUseCase implements ShowAllOrders {
  constructor(private readonly allOrders: AllOrders) {}

  async all(): Promise<OrderData[]> {
    return this.allOrders.all();
  }
}
