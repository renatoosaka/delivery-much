import { MongoDB } from '../../../infra/database/mongo';
import { OrderData } from '../../../domain/entities/orders';
import {
  AddOrder,
  AddOrderDTO,
} from '../../../usecases/protocols/order-repository';
import { OrderMapper } from './mapper/order-mapper';

export class OrderMongoRepository implements AddOrder {
  async add(data: AddOrderDTO): Promise<OrderData> {
    const collection = await MongoDB.getCollection('orders');
    const result = await collection.insertOne(data);
    const orderId = result.insertedId;

    const order = await collection
      .aggregate([
        {
          $match: {
            _id: orderId,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.id',
            foreignField: '_id',
            as: 'products_info',
          },
        },
      ])
      .toArray();

    return OrderMapper.map(order[0]);
  }
}
