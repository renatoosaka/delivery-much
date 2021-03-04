import faker from 'faker';
import {
  AddProductDTO,
  ProductRepository,
} from '../protocols/product-repository';
import { UpdateProductStockUseCase } from './update-product-stock-usecase';
import {
  UpdateProductStock,
  UpdateProductStockDTO,
} from '../protocols/update-product-stock-protocol';
import { ProductData } from '../../domain/entities/products';
import {
  MoreThanZeroError,
  ProductNotFoundError,
  RequiredValueError,
} from '../../domain/errors';

const DEFAULT_PRODUCT_QUANTITY = 1;
const PRODUCT_ID = faker.random.uuid();

interface SutTypes {
  sut: UpdateProductStock;
  productRepositoryStub: ProductRepository;
}

const makeProductRepositoryStub = (): ProductRepository => {
  class ProductRepositoryStub implements ProductRepository {
    async add(data: AddProductDTO): Promise<ProductData> {
      return {
        ...data,
        id: faker.random.uuid(),
      };
    }

    async find(name: string): Promise<ProductData | undefined> {
      return {
        name,
        id: PRODUCT_ID,
        price: faker.random.number({ min: 1 }),
        quantity: DEFAULT_PRODUCT_QUANTITY,
      };
    }

    async updateQuantity(
      id: string,
      quantity: number,
      operation: 'increase' | 'decrease',
    ): Promise<void> {
      console.log(id, quantity, operation);
    }
  }

  return new ProductRepositoryStub();
};

const makeSut = (): SutTypes => {
  const productRepositoryStub = makeProductRepositoryStub();
  const sut = new UpdateProductStockUseCase(productRepositoryStub);

  return { sut, productRepositoryStub };
};

const makeValidRequest = (): UpdateProductStockDTO => ({
  name: faker.name.findName(),
  quantity: DEFAULT_PRODUCT_QUANTITY,
  operation: 'increase',
});

describe('#UpdateProductStock UseCase', () => {
  it('should return an error if no required field is provided', async () => {
    const { sut } = makeSut();

    const data: {
      props: UpdateProductStockDTO;
      error: Error;
    }[] = [
      {
        props: {
          name: '',
          quantity: 1,
          operation: 'increase',
        },
        error: new RequiredValueError('name'),
      },
      {
        props: {
          name: faker.name.findName(),
          quantity: 0,
          operation: 'increase',
        },
        error: new RequiredValueError('quantity'),
      },
      {
        props: {
          name: faker.name.findName(),
          quantity: -1,
          operation: 'increase',
        },
        error: new MoreThanZeroError('quantity'),
      },
    ];

    await Promise.all(
      data.map(async item => {
        const response = await sut.update(item.props);

        expect(response.isLeft()).toBe(true);
        expect(response.value).toEqual(item.error);
      }),
    );
  });

  it('should call findProduct with correct value', async () => {
    const { sut, productRepositoryStub } = makeSut();

    const findSpy = jest.spyOn(productRepositoryStub, 'find');

    const requestData = makeValidRequest();
    await sut.update(requestData);

    expect(findSpy).toHaveBeenCalledWith(requestData.name);
  });

  it('should return error if no product was found', async () => {
    const { sut, productRepositoryStub } = makeSut();

    jest.spyOn(productRepositoryStub, 'find').mockResolvedValueOnce(undefined);

    const requestData = makeValidRequest();
    const error = await sut.update(requestData);

    expect(error.value).toEqual(new ProductNotFoundError(requestData.name));
  });

  it('should call updateQuantity with correct value', async () => {
    const { sut, productRepositoryStub } = makeSut();

    const updateQuantitySpy = jest.spyOn(
      productRepositoryStub,
      'updateQuantity',
    );

    const requestData = makeValidRequest();
    await sut.update(requestData);

    expect(updateQuantitySpy).toHaveBeenCalledWith(
      PRODUCT_ID,
      requestData.quantity,
      requestData.operation,
    );
  });

  it('should return a product on success', async () => {
    const { sut } = makeSut();

    const requestData = makeValidRequest();
    const productOrError = await sut.update(requestData);

    expect(productOrError.isLeft()).toEqual(false);
    expect(productOrError.isRight()).toEqual(true);
  });
});
