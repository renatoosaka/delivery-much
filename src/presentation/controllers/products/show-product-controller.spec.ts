import faker from 'faker';
import { ProductNotFoundError } from '../../errors';
import { Either, left, right } from '../../../shared';
import { notFound } from '../../helpers/http-helpers';
import { RequiredFieldError } from '../../../usecases/errors';
import { ProductData } from '../../../domain/entities/products';
import { Controller } from '../../protocols/controller-protocol';
import { ShowProductController } from './show-product-controller';
import { ShowProduct } from '../../../usecases/protocols/show-product-protocol';

interface SutTypes {
  sut: Controller;
  showProductStub: ShowProduct;
}

const makeShowProductStub = (): ShowProduct => {
  class ShowProductStub implements ShowProduct {
    async show(
      name: string,
    ): Promise<Either<RequiredFieldError, ProductData | undefined>> {
      return right({
        name,
        id: faker.random.uuid(),
        price: faker.random.number({ min: 1 }),
        quantity: faker.random.number({ min: 1 }),
      });
    }
  }

  return new ShowProductStub();
};

const makeSut = (): SutTypes => {
  const showProductStub = makeShowProductStub();
  const sut = new ShowProductController(showProductStub);

  return { sut, showProductStub };
};

describe('#ShowProduct Controller', () => {
  it('should call usecase with correct value', async () => {
    const { sut, showProductStub } = makeSut();

    const showSpy = jest.spyOn(showProductStub, 'show');

    const name = faker.name.findName();
    await sut.handle({ params: { name } });

    expect(showSpy).toHaveBeenCalledWith(name);
  });

  it('should return 400 if no name is provided', async () => {
    const { sut, showProductStub } = makeSut();

    jest
      .spyOn(showProductStub, 'show')
      .mockResolvedValueOnce(left(new RequiredFieldError('name')));

    const response = await sut.handle({ params: { name: '' } });

    expect(response.status_code).toBe(400);
  });

  it('should return 404 if no product was found', async () => {
    const { sut, showProductStub } = makeSut();

    const name = faker.name.findName();

    jest.spyOn(showProductStub, 'show').mockResolvedValueOnce(right(undefined));

    const response = await sut.handle({ params: { name } });

    expect(response).toEqual(notFound(new ProductNotFoundError(name)));
  });

  it('should return 500 usecase throws', async () => {
    const { sut, showProductStub } = makeSut();

    jest.spyOn(showProductStub, 'show').mockRejectedValueOnce(new Error());

    const response = await sut.handle({ params: { name: '' } });

    expect(response.status_code).toBe(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const name = faker.name.findName();
    const response = await sut.handle({ params: { name } });

    expect(response.status_code).toBe(200);
    expect(response.body.name).toBe(name);
  });
});
