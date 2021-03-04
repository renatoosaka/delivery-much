import { OrderData } from '../../../domain/entities/orders';

export interface AllOrders {
  all(): Promise<OrderData[]>;
}
