import faker from 'faker';
import { left } from '../../shared';
import { RequiredFieldError } from '../errors';
import { ShowOrderUseCase } from './show-order-usecase';
import { OrderData } from '../../domain/entities/orders';
import { ProductData } from '../../domain/entities/products';
import { ShowOrder } from '../protocols/show-order-protocol';
import { FindOrderById } from '../protocols/order-repository';

interface SutTypes {
  sut: ShowOrder;
  findOrderByIdStub: FindOrderById;
}

const makeFindOrderByIdStub = (): FindOrderById => {
  class FindOrderByIdStub implements FindOrderById {
    async find(id: string): Promise<OrderData | undefined> {
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

      return {
        id,
        products,
        total,
      };
    }
  }

  return new FindOrderByIdStub();
};

const makeSut = (): SutTypes => {
  const findOrderByIdStub = makeFindOrderByIdStub();
  const sut = new ShowOrderUseCase(findOrderByIdStub);

  return { sut, findOrderByIdStub };
};

describe('#ShowOrder UseCase', () => {
  it('should return RequiredFieldError if not id is provided', async () => {
    const { sut } = makeSut();

    const error = await sut.show('');

    expect(error).toEqual(left(new RequiredFieldError('id')));
  });

  it('should return call repo with correct value', async () => {
    const { sut, findOrderByIdStub } = makeSut();

    const findSpy = jest.spyOn(findOrderByIdStub, 'find');

    const id = faker.random.uuid();
    await sut.show(id);

    expect(findSpy).toHaveBeenCalledWith(id);
  });

  it('should return undefined if nothing was found', async () => {
    const { sut, findOrderByIdStub } = makeSut();

    jest.spyOn(findOrderByIdStub, 'find').mockResolvedValueOnce(undefined);

    const result = await sut.show(faker.random.uuid());

    expect(result.value).toBeFalsy();
  });

  it('should return a product on success', async () => {
    const { sut } = makeSut();

    const id = faker.random.uuid();
    const orderOrError = await sut.show(id);

    expect(orderOrError.isLeft()).toEqual(false);
    expect(orderOrError.isRight()).toEqual(true);
    expect(orderOrError.value).toBeTruthy();

    const order = orderOrError.value as OrderData;

    expect(order.id).toEqual(id);
  });
});
