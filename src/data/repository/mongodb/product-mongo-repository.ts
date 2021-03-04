import { MongoDB } from '../../../infra/database/mongo';
import { ProductData } from '../../../domain/entities/products';
import {
  AddProduct,
  AddProductDTO,
  FindProductByName,
  UpdateProductQuantity,
} from '../../../usecases/protocols/product-repository';

export class ProductMongoRepository
  implements AddProduct, FindProductByName, UpdateProductQuantity {
  async updateQuantity(
    id: string,
    quantity: number,
    operation: 'increase' | 'decrease',
  ): Promise<void> {
    const collection = await MongoDB.getCollection('products');

    await collection.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: { quantity: operation === 'increase' ? quantity : -quantity },
      },
    );
  }

  async find(name: string): Promise<ProductData | undefined> {
    const collection = await MongoDB.getCollection('products');
    const product = await collection.findOne({ name });

    if (!product) {
      return undefined;
    }

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
  }

  async add(data: AddProductDTO): Promise<ProductData> {
    const collection = await MongoDB.getCollection('products');
    const result = await collection.insertOne(data);
    const product = result.ops[0];

    return {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    };
  }
}
