import faker from 'faker';
import { right } from '../../../shared';
import { HTTPRequest } from '../../protocols/http-protocol';
import { Controller } from '../../protocols/controller-protocol';
import { UpdateProductStockController } from './update-product-stock-controller';
import {
  UpdateProductStock,
  UpdateProductStockDTO,
  UpdateProductStockResponse,
} from '../../../usecases/protocols/update-product-stock-protocol';

interface SutTypes {
  sut: Controller;
  updateProductStockStub: UpdateProductStock;
}

const makeUpdateProductStockStub = (): UpdateProductStock => {
  class UpdateProductStockStub implements UpdateProductStock {
    async update(
      data: UpdateProductStockDTO,
    ): Promise<UpdateProductStockResponse> {
      return new Promise(resolve =>
        resolve(
          right({
            id: faker.random.uuid(),
            name: data.name,
            price: faker.random.number({ min: 1 }),
            quantity: faker.random.number({ min: 1 }),
          }),
        ),
      );
    }
  }

  return new UpdateProductStockStub();
};

const makeSut = (): SutTypes => {
  const updateProductStockStub = makeUpdateProductStockStub();
  const sut = new UpdateProductStockController(updateProductStockStub);

  return {
    sut,
    updateProductStockStub,
  };
};

const makeValidRequest = (): HTTPRequest => ({
  body: {
    quantity: faker.random.number({ min: 1 }),
    operation: 'increase',
  },
  params: {
    name: faker.name.findName(),
  },
});

describe('CreateProduct Controller', () => {
  it('should call updateProductStockStub usecase with correct value', async () => {
    const { sut, updateProductStockStub } = makeSut();

    const updateSpy = jest.spyOn(updateProductStockStub, 'update');

    const request = makeValidRequest();

    await sut.handle(request);

    expect(updateSpy).toHaveBeenCalledWith({
      name: request.params.name,
      quantity: request.body.quantity,
      operation: request.body.operation,
    });
  });

  it('should return 500 if usecase throws an error', async () => {
    const { sut, updateProductStockStub } = makeSut();

    jest
      .spyOn(updateProductStockStub, 'update')
      .mockRejectedValueOnce(new Error());

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.name).toEqual(request.params.name);
  });
});
