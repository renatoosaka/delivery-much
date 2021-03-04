import faker from 'faker';
import { Either, left, right } from '../../../shared';
import { notFound } from '../../helpers/http-helpers';
import { RequiredFieldError } from '../../../usecases/errors';
import { ProductData } from '../../../domain/entities/products';
import { Controller } from '../../protocols/controller-protocol';
import { ShowOrder } from '../../../usecases/protocols/show-order-protocol';
import { OrderData } from '../../../domain/entities/orders';
import { ShowOrderController } from './show-order-controller';
import { OrderNotFoundError } from '../../errors';

interface SutTypes {
  sut: Controller;
  showOrderStub: ShowOrder;
}

const makeShowOrderStub = (): ShowOrder => {
  class ShowOrderStub implements ShowOrder {
    async show(
      id: string,
    ): Promise<Either<RequiredFieldError, OrderData | undefined>> {
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

      return right({ id, products, total });
    }
  }

  return new ShowOrderStub();
};

const makeSut = (): SutTypes => {
  const showOrderStub = makeShowOrderStub();
  const sut = new ShowOrderController(showOrderStub);

  return { sut, showOrderStub };
};

describe('#ShowOrder Controller', () => {
  it('should call usecase with correct value', async () => {
    const { sut, showOrderStub } = makeSut();

    const showSpy = jest.spyOn(showOrderStub, 'show');

    const id = faker.random.uuid();
    await sut.handle({ params: { id } });

    expect(showSpy).toHaveBeenCalledWith(id);
  });

  it('should return 400 if no id is provided', async () => {
    const { sut, showOrderStub } = makeSut();

    jest
      .spyOn(showOrderStub, 'show')
      .mockResolvedValueOnce(left(new RequiredFieldError('name')));

    const response = await sut.handle({ params: { id: '' } });

    expect(response.status_code).toBe(400);
  });

  it('should return 404 if no order was found', async () => {
    const { sut, showOrderStub } = makeSut();

    const id = faker.random.uuid();

    jest.spyOn(showOrderStub, 'show').mockResolvedValueOnce(right(undefined));

    const response = await sut.handle({ params: { id } });

    expect(response).toEqual(notFound(new OrderNotFoundError(id)));
  });

  it('should return 500 usecase throws', async () => {
    const { sut, showOrderStub } = makeSut();

    jest.spyOn(showOrderStub, 'show').mockRejectedValueOnce(new Error());

    const response = await sut.handle({ params: { id: faker.random.uuid() } });

    expect(response.status_code).toBe(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const id = faker.random.uuid();
    const response = await sut.handle({ params: { id } });

    expect(response.status_code).toBe(200);
    expect(response.body.id).toBe(id);
  });
});
