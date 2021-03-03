import faker from 'faker';
import { MoreThanZeroError } from '../../errors';
import { ProductQuantity } from './product-quantity';

describe('#ProductQuantity Value Object', () => {
  it('should return MoreThanZeroError', async () => {
    const quantityOrError = ProductQuantity.create(0);

    expect(quantityOrError.isLeft()).toBe(true);

    expect(quantityOrError.isRight()).toBe(false);

    const error = quantityOrError.value;

    expect(error).toEqual(new MoreThanZeroError('quantity'));
  });

  it('should return the correct quantity', async () => {
    const faker_quantity = faker.random.number({ min: 1 });

    const quantityOrError = ProductQuantity.create(faker_quantity);

    expect(quantityOrError.isLeft()).toBe(false);

    expect(quantityOrError.isRight()).toBe(true);

    const quantity = quantityOrError.value as ProductQuantity;

    expect(quantity.value).toEqual(faker_quantity);
  });
});
