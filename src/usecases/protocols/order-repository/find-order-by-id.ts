import { OrderData } from '../../../domain/entities/orders';

export interface FindOrderById {
  find(id: string): Promise<OrderData | undefined>;
}
