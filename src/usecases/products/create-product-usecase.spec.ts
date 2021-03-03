import faker from 'faker';
import { ProductData } from '../../domain/entities/products';
import { CreateProductUseCase } from './create-product-usecase';
import { AddProduct, AddProductDTO } from '../protocols/product-repository';
import {
  MoreThanZeroError,
  RequiredValueError,
  ShortTextError,
} from '../../domain/errors';
import {
  CreateProduct,
  CreateProductDTO,
} from '../protocols/create-product-protocols';

interface SutTypes {
  sut: CreateProduct;
  addProductStub: AddProduct;
}

const makeAddProductStub = (): AddProduct => {
  class AddProductStub implements AddProduct {
    add(data: AddProductDTO): Promise<ProductData> {
      return new Promise(resolve =>
        resolve({
          ...data,
          id: faker.random.uuid(),
        }),
      );
    }
  }

  return new AddProductStub();
};

const makeSut = (): SutTypes => {
  const addProductStub = makeAddProductStub();

  const sut = new CreateProductUseCase(addProductStub);

  return { sut, addProductStub };
};

const makeValidRequest = (): CreateProductDTO => ({
  name: faker.name.findName(),
  price: faker.random.number({ min: 1 }),
  quantity: faker.random.number({ min: 1 }),
});

describe('#CreateProductUseCase', () => {
  it('should return an error if required fields is not provided', async () => {
    const { sut } = makeSut();

    const data = [
      {
        props: {
          name: '',
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
        error: new RequiredValueError('name'),
      },
      {
        props: {
          name: 'ab',
          price: faker.random.number({ min: 1 }),
          quantity: faker.random.number({ min: 1 }),
        },
        error: new ShortTextError('name', 3),
      },
      {
        props: {
          name: faker.name.findName(),
          price: 0,
          quantity: faker.random.number({ min: 1 }),
        },
        error: new MoreThanZeroError('price'),
      },
      {
        props: {
          name: faker.name.findName(),
          price: faker.random.number({ min: 1 }),
          quantity: 0,
        },
        error: new MoreThanZeroError('quantity'),
      },
    ];

    await Promise.all(
      data.map(async item => {
        const response = await sut.create(item.props);

        expect(response.isLeft()).toBe(true);
        expect(response.value).toEqual(item.error);
      }),
    );
  });

  it('should call AddProduct with correct value', async () => {
    const { sut, addProductStub } = makeSut();

    const addSpy = jest.spyOn(addProductStub, 'add');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(addSpy).toHaveBeenCalledWith(requestData);
  });

  it('should throws an error if any dependency throw', async () => {
    const { sut, addProductStub } = makeSut();

    jest.spyOn(addProductStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();
  });

  it('should return Product on success', async () => {
    const { sut } = makeSut();

    const requestData = makeValidRequest();

    const productOrError = await sut.create(requestData);

    const product = productOrError.value as ProductData;

    expect(productOrError.isRight()).toBe(true);
    expect(product.id).toBeTruthy();
    expect(product.name).toEqual(requestData.name);
    expect(product.price).toEqual(requestData.price);
    expect(product.quantity).toEqual(requestData.quantity);
  });
});
