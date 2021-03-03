import faker from 'faker';
import { ProductData } from '../../domain/entities/products';
import { left } from '../../shared';
import { RequiredFieldError } from '../errors';
import { ShowProduct } from '../protocols/show-product-protocol';
import { FindProductByName } from '../protocols/product-repository';
import { ShowProductUseCase } from './show-product-usecase';

interface SutTypes {
  sut: ShowProduct;
  findProductByNameStub: FindProductByName;
}

const makeFindProductByNameStub = (): FindProductByName => {
  class FindProductByNameStub implements FindProductByName {
    async find(name: string): Promise<ProductData | undefined> {
      return {
        name,
        id: faker.random.uuid(),
        price: faker.random.number({ min: 1 }),
        quantity: faker.random.number({ min: 1 }),
      };
    }
  }

  return new FindProductByNameStub();
};

const makeSut = (): SutTypes => {
  const findProductByNameStub = makeFindProductByNameStub();
  const sut = new ShowProductUseCase(findProductByNameStub);

  return { sut, findProductByNameStub };
};

describe('#FindProduct UseCase', () => {
  it('should return RequiredFieldError if not name is provided', async () => {
    const { sut } = makeSut();

    const error = await sut.show('');

    expect(error).toEqual(left(new RequiredFieldError('name')));
  });

  it('should return call repo with correct value', async () => {
    const { sut, findProductByNameStub } = makeSut();

    const findSpy = jest.spyOn(findProductByNameStub, 'find');

    const name = faker.name.findName();
    await sut.show(name);

    expect(findSpy).toHaveBeenCalledWith(name);
  });

  it('should return undefined if nothing was found', async () => {
    const { sut, findProductByNameStub } = makeSut();

    jest.spyOn(findProductByNameStub, 'find').mockResolvedValueOnce(undefined);

    const name = faker.name.findName();
    const result = await sut.show(name);

    expect(result.value).toBeFalsy();
  });

  it('should return a product on success', async () => {
    const { sut } = makeSut();

    const name = faker.name.findName();
    const product = await sut.show(name);

    expect(product.isLeft()).toEqual(false);
    expect(product.isRight()).toEqual(true);
    expect(product.value).toBeTruthy();
    expect(product.value?.name).toEqual(name);
  });
});
