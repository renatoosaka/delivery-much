import faker from 'faker';
import { MongoDB } from '../../../infra/database/mongo';
import { OrderMongoRepository } from './order-mongo-repository';
import { ProductData } from '../../../domain/entities/products';

const makeSut = (): OrderMongoRepository => {
  return new OrderMongoRepository();
};

const makeValidProduct = (): ProductData => ({
  name: faker.name.findName(),
  price: faker.random.number({ min: 1 }),
  quantity: faker.random.number({ min: 1 }),
});

describe('#OrderMongoRepository', () => {
  let product: ProductData;

  beforeAll(async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);

    const collection = await MongoDB.getCollection('products');
    const result = await collection.insertOne(makeValidProduct());

    product = {
      id: result.ops[0]._id,
      name: result.ops[0].name,
      price: result.ops[0].price,
      quantity: result.ops[0].quantity,
    };
  });

  afterAll(async () => {
    const collection = await MongoDB.getCollection('products');

    await collection.deleteMany({});

    await MongoDB.disconnect();
  });

  it('should return a order on success', async () => {
    const sut = makeSut();

    const order = await sut.add({
      products: [
        {
          id: product.id as string,
          price: product.price,
          quantity: 1,
        },
      ],
    });

    expect(order).toBeTruthy();
    expect(order.id).toBeTruthy();
    expect(order.products).toBeTruthy();
    expect(order.total).toEqual(product.price);
  });
});
