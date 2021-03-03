import faker from 'faker';
import { right } from '../../../shared';
import { HTTPRequest } from '../../protocols/http-protocol';
import { Controller } from '../../protocols/controller-protocol';
import { CreateProductController } from './create-product-controller';
import {
  CreateProduct,
  CreateProductDTO,
  CreateProductResponse,
} from '../../../usecases/protocols/create-product-protocols';

interface SutTypes {
  sut: Controller;
  createProductStub: CreateProduct;
}

const makeCreateProductStub = (): CreateProduct => {
  class CreateProductStub implements CreateProduct {
    async create(data: CreateProductDTO): Promise<CreateProductResponse> {
      return new Promise(resolve =>
        resolve(
          right({
            ...data,
            id: faker.random.uuid(),
          }),
        ),
      );
    }
  }

  return new CreateProductStub();
};

const makeSut = (): SutTypes => {
  const createProductStub = makeCreateProductStub();
  const sut = new CreateProductController(createProductStub);

  return {
    sut,
    createProductStub,
  };
};

const makeValidRequest = (): HTTPRequest => ({
  body: {
    name: faker.name.findName(),
    price: faker.random.number({ min: 1 }),
    quantity: faker.random.number({ min: 1 }),
  },
});

describe('CreateProduct Controller', () => {
  it('should call CreateProduct usecase with correct value', async () => {
    const { sut, createProductStub } = makeSut();

    const createSpy = jest.spyOn(createProductStub, 'create');

    const request = makeValidRequest();

    await sut.handle(request);

    expect(createSpy).toHaveBeenCalledWith({
      name: request.body.name,
      price: request.body.price,
      quantity: request.body.quantity,
    });
  });

  it('should return 500 if usecase throws an error', async () => {
    const { sut, createProductStub } = makeSut();

    jest.spyOn(createProductStub, 'create').mockRejectedValueOnce(new Error());

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(500);
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.name).toEqual(request.body.name);
    expect(response.body.price).toEqual(request.body.price);
    expect(response.body.quantity).toEqual(request.body.quantity);
  });
});
