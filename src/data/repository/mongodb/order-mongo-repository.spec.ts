import faker from 'faker';
import { MongoDB } from '../../../infra/database/mongo';
import { AddOrderDTO } from '../../../usecases/protocols/order-repository';
import { OrderMongoRepository } from './order-mongo-repository';

const makeSut = (): OrderMongoRepository => {
  return new OrderMongoRepository();
};

const makeValidCreateData = (): AddOrderDTO => ({
  products: [
    {
      id: faker.random.uuid(),
      price: faker.random.number({ min: 1 }),
      quantity: faker.random.number({ min: 1 }),
    },
  ],
});

describe('#OrderMongoRepository', () => {
  beforeAll(async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoDB.disconnect();
  });

  it('should return a order on success', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    const order = await sut.add(createDataDTO);

    expect(order).toBeTruthy();
    expect(order.id).toBeTruthy();
    expect(order.products).toBeTruthy();
    // expect(order.total).toEqual(createDataDTO.price);
  });
});
