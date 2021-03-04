import faker from 'faker';
import { OrderData } from '../../domain/entities/orders';
import { CreateOrderUseCase } from './create-order-usecase';
import { ProductData } from '../../domain/entities/products';
import { FindProductByName } from '../protocols/product-repository';
import { AddOrder, AddOrderDTO } from '../protocols/order-repository';
import {
  DuplicatedProductsError,
  MoreThanZeroError,
  RequiredValueError,
} from '../../domain/errors';
import {
  CreateOrder,
  CreateOrderDTO,
} from '../protocols/create-order-protocol';
import { ProductNotFoundError } from '../../domain/errors/product-notfound-error';
import { OrderQuantityError } from '../errors';

const DEFAULT_PRODUCT_PRICE = 1;
const DEFAULT_PRODUCT_QUANTITY = 1;

interface SutTypes {
  sut: CreateOrder;
  addOrderStub: AddOrder;
  findProductStub: FindProductByName;
}

const makeAddOrderStub = (): AddOrder => {
  class AddOrderStub implements AddOrder {
    async add(data: AddOrderDTO): Promise<OrderData> {
      const products = data.products.map(product => ({
        ...product,
        name: faker.name.findName(),
        price: DEFAULT_PRODUCT_PRICE,
      }));

      return new Promise(resolve =>
        resolve({
          products,
          id: faker.random.uuid(),
          total: products.reduce(
            (value, product) => product.price * product.quantity + value,
            0,
          ),
        }),
      );
    }
  }

  return new AddOrderStub();
};

const makeFindProductByNameStub = (): FindProductByName => {
  class FindProductByNameStub implements FindProductByName {
    async find(name: string): Promise<ProductData | undefined> {
      return {
        name,
        id: faker.random.uuid(),
        price: faker.random.number({ min: 1 }),
        quantity: DEFAULT_PRODUCT_QUANTITY,
      };
    }
  }

  return new FindProductByNameStub();
};

const makeSut = (): SutTypes => {
  const addOrderStub = makeAddOrderStub();
  const findProductStub = makeFindProductByNameStub();
  const sut = new CreateOrderUseCase(findProductStub, addOrderStub);

  return { sut, findProductStub, addOrderStub };
};

const makeValidRequest = (): CreateOrderDTO => ({
  products: [
    {
      name: faker.name.findName(),
      quantity: DEFAULT_PRODUCT_QUANTITY,
    },
    {
      name: faker.name.findName(),
      quantity: DEFAULT_PRODUCT_QUANTITY,
    },
  ],
});

describe('#CreateOrderUseCase', () => {
  it('should return an error if required fields is not provided', async () => {
    const { sut } = makeSut();

    const name = faker.name.findName();
    const data = [
      {
        props: {
          products: [],
        },
        error: new RequiredValueError('products'),
      },
      {
        props: {
          products: [
            {
              name: faker.name.findName(),
              quantity: 0,
            },
          ],
        },
        error: new MoreThanZeroError('quantity'),
      },
      {
        props: {
          products: [
            {
              name,
              quantity: DEFAULT_PRODUCT_QUANTITY,
            },
            {
              name,
              quantity: DEFAULT_PRODUCT_QUANTITY,
            },
          ],
        },
        error: new DuplicatedProductsError(),
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

  it('should call findProduct with correct value', async () => {
    const { sut, findProductStub } = makeSut();

    const findSpy = jest.spyOn(findProductStub, 'find');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(findSpy).toHaveBeenCalledWith(requestData.products[0].name);
  });

  it('should return an error if product not found', async () => {
    const { sut, findProductStub } = makeSut();

    jest.spyOn(findProductStub, 'find').mockResolvedValueOnce(undefined);

    const requestData = makeValidRequest();
    const response = await sut.create(requestData);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toEqual(
      new ProductNotFoundError(requestData.products[0].name),
    );
  });

  it('should return an error if product does not have enough quantity', async () => {
    const { sut } = makeSut();

    const requestData = {
      products: [
        {
          name: faker.name.findName(),
          quantity: DEFAULT_PRODUCT_QUANTITY + 1,
        },
      ],
    };
    const response = await sut.create(requestData);

    expect(response.isLeft()).toBe(true);
    expect(response.value).toEqual(
      new OrderQuantityError(requestData.products[0].name),
    );
  });

  it('should call AddOrder with correct value', async () => {
    const { sut, addOrderStub, findProductStub } = makeSut();

    const addSpy = jest.spyOn(addOrderStub, 'add');

    const requestData = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      price: faker.random.number({ min: 1 }),
      quantity: faker.random.number({ min: 1 }),
    };

    jest.spyOn(findProductStub, 'find').mockResolvedValueOnce(requestData);

    await sut.create({
      products: [
        {
          name: requestData.name,
          quantity: requestData.quantity,
        },
      ],
    });

    expect(addSpy).toHaveBeenCalledWith({
      products: [
        {
          id: requestData.id,
          price: requestData.price,
          quantity: requestData.quantity,
        },
      ],
    });
  });

  it('should throws an error if any dependency throw', async () => {
    const { sut, addOrderStub, findProductStub } = makeSut();

    jest.spyOn(addOrderStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest.spyOn(findProductStub, 'find').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();
  });

  it('should return Order on success', async () => {
    const { sut } = makeSut();

    const requestData = makeValidRequest();

    const orderOrError = await sut.create(requestData);

    const order = orderOrError.value as OrderData;

    const total_order = requestData.products.reduce(
      (value, product) => DEFAULT_PRODUCT_PRICE * product.quantity + value,
      0,
    );

    expect(orderOrError.isRight()).toBe(true);
    expect(order.id).toBeTruthy();
    expect(order.total).toEqual(total_order);
    expect(order.products).toBeTruthy();
    expect(order.products.length).toEqual(requestData.products.length);
  });
});
