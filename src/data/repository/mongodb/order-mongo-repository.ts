import { MongoDB } from '../../../infra/database/mongo';
import { OrderData } from '../../../domain/entities/orders';
import {
  AddOrder,
  AddOrderDTO,
} from '../../../usecases/protocols/order-repository';

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
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.id',
            foreignField: '_id',
            as: 'products',
          },
        },
      ])
      .toArray();

    const products = result.ops[0].products.map(item => {
      const product = order[0].products.find(
        p => p._id.toString() === item.id.toString(),
      );

      return {
        name: product.name,
        quantity: item.quantity,
        price: item.quantity * item.price,
      };
    });

    const total = products.reduce(
      (value, product) => product.price * product.quantity + value,
      0,
    );

    return {
      id: orderId,
      products,
      total,
    };
  }
}
