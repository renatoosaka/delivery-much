import faker from 'faker';
import { right } from '../../../shared';
import { HTTPRequest } from '../../protocols/http-protocol';
import { Controller } from '../../protocols/controller-protocol';
import { CreateOrderController } from './create-order-controller';
import {
  CreateOrder,
  CreateOrderDTO,
  CreateOrderResponse,
} from '../../../usecases/protocols/create-order-protocol';

const DEFAULT_PRODUCT_PRICE = 1;

interface SutTypes {
  sut: Controller;
  createOrderStub: CreateOrder;
}

const makeCreateOrderStub = (): CreateOrder => {
  class CreateOrderStub implements CreateOrder {
    async create(data: CreateOrderDTO): Promise<CreateOrderResponse> {
      const products = data.products.map(product => ({
        ...product,
        price: faker.random.number({ min: 1 }),
      }));
      return new Promise(resolve =>
        resolve(
          right({
            products,
            id: faker.random.uuid(),
            total: products.reduce(
              (value, product) =>
                DEFAULT_PRODUCT_PRICE * product.quantity + value,
              0,
            ),
          }),
        ),
      );
    }
  }

  return new CreateOrderStub();
};

const makeSut = (): SutTypes => {
  const createOrderStub = makeCreateOrderStub();
  const sut = new CreateOrderController(createOrderStub);

  return {
    sut,
    createOrderStub,
  };
};

const makeValidRequest = (): HTTPRequest => ({
  body: {
    products: [
      {
        name: faker.name.findName(),
        quantity: faker.random.number({ min: 1 }),
      },
    ],
  },
});

describe('CreateProduct Controller', () => {
  it('should call CreateOrder usecase with correct value', async () => {
    const { sut, createOrderStub } = makeSut();

    const createSpy = jest.spyOn(createOrderStub, 'create');

    const request = makeValidRequest();

    await sut.handle(request);

    expect(createSpy).toHaveBeenCalledWith(request.body);
  });

  it('should return 500 if usecase throws an error', async () => {
    const { sut, createOrderStub } = makeSut();

    jest.spyOn(createOrderStub, 'create').mockRejectedValueOnce(new Error());

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(500);
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();

    const request = makeValidRequest();

    const response = await sut.handle(request);

    const total_order = request.body.products.reduce(
      (value, product) => DEFAULT_PRODUCT_PRICE * product.quantity + value,
      0,
    );

    expect(response.status_code).toEqual(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.products).toBeTruthy();
    expect(response.body.products[0].name).toEqual(
      request.body.products[0].name,
    );
    expect(response.body.total).toEqual(total_order);
  });
});
