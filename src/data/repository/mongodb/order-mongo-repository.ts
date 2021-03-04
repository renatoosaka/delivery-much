import { ObjectId } from 'mongodb';
import { OrderMapper } from './mapper/order-mapper';
import { MongoDB } from '../../../infra/database/mongo';
import { OrderData } from '../../../domain/entities/orders';
import {
  AddOrder,
  AddOrderDTO,
  AllOrders,
  FindOrderById,
} from '../../../usecases/protocols/order-repository';

export class OrderMongoRepository
  implements AddOrder, FindOrderById, AllOrders {
  async all(): Promise<OrderData[]> {
    const collection = await MongoDB.getCollection('orders');

    const order = await collection
      .aggregate([
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

    return OrderMapper.mapArray(order);
  }

  async find(id: string): Promise<OrderData | undefined> {
    const collection = await MongoDB.getCollection('orders');

    const order = await collection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
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
