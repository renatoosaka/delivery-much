import { OrderData } from '../../domain/entities/orders';

export interface ShowAllOrders {
  all(): Promise<OrderData[]>;
}
