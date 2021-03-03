import faker from 'faker';
import { Product, ProductData } from '.';
import { Either } from '../../../shared';
import {
  MoreThanZeroError,
  RequiredValueError,
  ShortTextError,
} from '../../errors';

describe('#Product', () => {
  it('should return a error if does not provided correct values', () => {
    let productOrError: Either<
      RequiredValueError | MoreThanZeroError | ShortTextError,
      Product
    >;

    productOrError = Product.create({
      name: '',
      quantity: faker.random.number({ min: 1 }),
      price: faker.random.number({ min: 1 }),
    });

    expect(productOrError.isLeft()).toEqual(true);
    expect(productOrError.isRight()).toEqual(false);
    expect(productOrError.value).toEqual(new RequiredValueError('name'));

    productOrError = Product.create({
      name: 'ab',
      quantity: faker.random.number({ min: 1 }),
      price: faker.random.number({ min: 1 }),
    });

    expect(productOrError.isLeft()).toEqual(true);
    expect(productOrError.isRight()).toEqual(false);
    expect(productOrError.value).toEqual(new ShortTextError('name', 3));

    productOrError = Product.create({
      name: faker.name.findName(),
      quantity: 0,
      price: faker.random.number({ min: 1 }),
    });

    expect(productOrError.isLeft()).toEqual(true);
    expect(productOrError.isRight()).toEqual(false);
    expect(productOrError.value).toEqual(new MoreThanZeroError('quantity'));

    productOrError = Product.create({
      name: faker.name.findName(),
      quantity: faker.random.number({ min: 1 }),
      price: 0,
    });

    expect(productOrError.isLeft()).toEqual(true);
    expect(productOrError.isRight()).toEqual(false);
    expect(productOrError.value).toEqual(new MoreThanZeroError('price'));
  });

  it('should return a product on success', () => {
    const productData: ProductData = {
      name: faker.name.findName(),
      quantity: faker.random.number({ min: 1 }),
      price: faker.random.number({ min: 1 }),
    };

    const productOrError = Product.create(productData);

    expect(productOrError.isRight()).toEqual(true);
    expect(productOrError.isLeft()).toEqual(false);
  });
});
