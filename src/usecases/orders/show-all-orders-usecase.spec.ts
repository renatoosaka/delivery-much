import faker from 'faker';
import { left } from '../../shared';
import { RequiredFieldError } from '../errors';
import { OrderData } from '../../domain/entities/orders';
import { ProductData } from '../../domain/entities/products';
import { AllOrders } from '../protocols/order-repository';
import { ShowAllOrders } from '../protocols/show-all-order-protocol';
import { ShowAllOrdersUseCase } from './show-all-orders-usecase';

interface SutTypes {
  sut: ShowAllOrders;
  allOrdersStub: AllOrders;
}

const makeAllOrdersStub = (): AllOrders => {
  class AllOrdersStub implements AllOrders {
    async all(): Promise<OrderData[]> {
      const products: ProductData[] = [
        {
          id: faker.random.uuid(),
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
      ];

      const total = products.reduce(
        (value, product) => product.quantity * product.price + value,
        0,
      );

      return [
        {
          id: faker.random.uuid(),
          products,
          total,
        },
      ];
    }
  }

  return new AllOrdersStub();
};

const makeSut = (): SutTypes => {
  const allOrdersStub = makeAllOrdersStub();
  const sut = new ShowAllOrdersUseCase(allOrdersStub);

  return { sut, allOrdersStub };
};

describe('#ShowAllOrders UseCase', () => {
  it('should return an empty array if nothing was found', async () => {
    const { sut, allOrdersStub } = makeSut();

    jest.spyOn(allOrdersStub, 'all').mockResolvedValueOnce([]);

    const result = await sut.all();

    expect(result.length).toBe(0);
  });

  it('should return an array with orders on success', async () => {
    const { sut } = makeSut();
    const id = faker.random.uuid();

    const orders = await sut.all();

    expect(orders.length).toBeGreaterThanOrEqual(1);
  });
});
