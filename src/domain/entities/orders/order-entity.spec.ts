import faker from 'faker';
import { Either } from '../../../shared';
import {
  DuplicatedProductsError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../errors';
import { Order, OrderData } from '.';

describe('#Order', () => {
  it('should return a error if does not provided correct values', () => {
    let orderOrError: Either<
      RequiredValueError | MoreThanZeroError | DuplicatedProductsError,
      Order
    >;

    orderOrError = Order.create({
      products: [],
    });

    expect(orderOrError.isLeft()).toEqual(true);
    expect(orderOrError.isRight()).toEqual(false);
    expect(orderOrError.value).toEqual(new RequiredValueError('products'));

    orderOrError = Order.create({
      products: [
        {
          name: faker.name.findName(),
          price: 0,
          quantity: faker.random.number({ min: 1 }),
        },
      ],
    });

    expect(orderOrError.isLeft()).toEqual(true);
    expect(orderOrError.isRight()).toEqual(false);
    expect(orderOrError.value).toEqual(new MoreThanZeroError('price'));

    orderOrError = Order.create({
      products: [
        {
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: 0,
        },
      ],
    });

    expect(orderOrError.isLeft()).toEqual(true);
    expect(orderOrError.isRight()).toEqual(false);
    expect(orderOrError.value).toEqual(new MoreThanZeroError('quantity'));

    const name = faker.name.findName();
    orderOrError = Order.create({
      products: [
        {
          name,
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
        {
          name,
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
      ],
    });

    expect(orderOrError.isLeft()).toEqual(true);
    expect(orderOrError.isRight()).toEqual(false);
    expect(orderOrError.value).toEqual(new DuplicatedProductsError());
  });

  it('should return a order on success', () => {
    const orderData: OrderData = {
      products: [
        {
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
        {
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
        {
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
      ],
    };

    const orderOrError = Order.create(orderData);

    expect(orderOrError.isRight()).toEqual(true);
    expect(orderOrError.isLeft()).toEqual(false);
  });
});
