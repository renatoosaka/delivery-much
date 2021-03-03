import faker from 'faker';
import { MoreThanZeroError } from '../../errors';
import { ProductPrice } from './product-price';

describe('#ProductPrice Value Object', () => {
  it('should return MoreThanZeroError', async () => {
    const priceOrError = ProductPrice.create(0);

    expect(priceOrError.isLeft()).toBe(true);

    expect(priceOrError.isRight()).toBe(false);

    const error = priceOrError.value;

    expect(error).toEqual(new MoreThanZeroError('price'));
  });

  it('should return the correct price', async () => {
    const faker_price = faker.random.number({ min: 1 });

    const quantityOrError = ProductPrice.create(faker_price);

    expect(quantityOrError.isLeft()).toBe(false);

    expect(quantityOrError.isRight()).toBe(true);

    const quantity = quantityOrError.value as ProductPrice;

    expect(quantity.value).toEqual(faker_price);
  });
});
