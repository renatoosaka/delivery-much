import faker from 'faker';
import { OrderData } from '../../../domain/entities/orders';
import { ProductData } from '../../../domain/entities/products';
import { Controller } from '../../protocols/controller-protocol';
import { ShowAllOrdersController } from './show-all-orders-controller';
import { ShowAllOrders } from '../../../usecases/protocols/show-all-order-protocol';

interface SutTypes {
  sut: Controller;
  showAllOrdersStub: ShowAllOrders;
}

const makeShowAllOrdersStub = (): ShowAllOrders => {
  class ShowAllOrdersStub implements ShowAllOrders {
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

      return [{ id: faker.random.uuid(), products, total }];
    }
  }

  return new ShowAllOrdersStub();
};

const makeSut = (): SutTypes => {
  const showAllOrdersStub = makeShowAllOrdersStub();
  const sut = new ShowAllOrdersController(showAllOrdersStub);

  return { sut, showAllOrdersStub };
};

describe('#ShowAllOrders Controller', () => {
  it('should call usecase with correct value', async () => {
    const { sut, showAllOrdersStub } = makeSut();

    const showSpy = jest.spyOn(showAllOrdersStub, 'all');

    await sut.handle({});

    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an empty arrat if no order was found', async () => {
    const { sut, showAllOrdersStub } = makeSut();

    jest.spyOn(showAllOrdersStub, 'all').mockResolvedValueOnce([]);

    const response = await sut.handle({});

    expect(response.body.length).toBe(0);
  });

  it('should return 500 usecase throws', async () => {
    const { sut, showAllOrdersStub } = makeSut();

    jest.spyOn(showAllOrdersStub, 'all').mockRejectedValueOnce(new Error());

    const response = await sut.handle({});

    expect(response.status_code).toBe(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const id = faker.random.uuid();
    const response = await sut.handle({});

    expect(response.status_code).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
