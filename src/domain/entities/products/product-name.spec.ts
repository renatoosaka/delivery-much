import faker from 'faker';
import { RequiredValueError, ShortTextError } from '../../errors';
import { ProductName } from './product-name';

describe('#ProductName Value Object', () => {
  it('should return RequiredValueError', async () => {
    const nameOrError = ProductName.create('');

    expect(nameOrError.isLeft()).toBe(true);

    expect(nameOrError.isRight()).toBe(false);

    const error = nameOrError.value;

    expect(error).toEqual(new RequiredValueError('name'));
  });

  it('should return ShortTextError', async () => {
    const nameOrError = ProductName.create('abc');

    expect(nameOrError.isLeft()).toBe(true);

    expect(nameOrError.isRight()).toBe(false);

    const error = nameOrError.value;

    expect(error).toEqual(new ShortTextError('name', 3));
  });

  it('should return the correct name', async () => {
    const faker_name = faker.name.findName();

    const nameOrError = ProductName.create(faker_name);

    expect(nameOrError.isLeft()).toBe(false);

    expect(nameOrError.isRight()).toBe(true);

    const name = nameOrError.value as ProductName;

    expect(name.value).toEqual(faker_name);
  });
});
