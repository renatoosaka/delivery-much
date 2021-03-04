import faker from 'faker';
import { OrderData } from '../../domain/entities/orders';
import { CreateOrderUseCase } from './create-order-usecase';
import { ProductData } from '../../domain/entities/products';
import {
  AddProductDTO,
  ProductRepository,
} from '../protocols/product-repository';
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
  productRepositoryStub: ProductRepository;
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

const PRODUCT_ID = faker.random.uuid();

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
  const addOrderStub = makeAddOrderStub();
  const productRepositoryStub = makeProductRepositoryStub();
  const sut = new CreateOrderUseCase(productRepositoryStub, addOrderStub);

  return { sut, addOrderStub, productRepositoryStub };
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
    const { sut, productRepositoryStub } = makeSut();

    const findSpy = jest.spyOn(productRepositoryStub, 'find');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(findSpy).toHaveBeenCalledWith(requestData.products[0].name);
  });

  it('should call updateQuantity with correct value', async () => {
    const { sut, productRepositoryStub } = makeSut();

    const updateQuantitySpy = jest.spyOn(
      productRepositoryStub,
      'updateQuantity',
    );

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(updateQuantitySpy).toHaveBeenCalledWith(
      PRODUCT_ID,
      requestData.products[0].quantity,
      'decrease',
    );
  });

  it('should return an error if product not found', async () => {
    const { sut, productRepositoryStub } = makeSut();

    jest.spyOn(productRepositoryStub, 'find').mockResolvedValueOnce(undefined);

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
    const { sut, addOrderStub, productRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addOrderStub, 'add');

    const requestData = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      price: faker.random.number({ min: 1 }),
      quantity: faker.random.number({ min: 1 }),
    };

    jest
      .spyOn(productRepositoryStub, 'find')
      .mockResolvedValueOnce(requestData);

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
    const { sut, addOrderStub, productRepositoryStub } = makeSut();

    jest.spyOn(addOrderStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest
      .spyOn(productRepositoryStub, 'find')
      .mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest
      .spyOn(productRepositoryStub, 'updateQuantity')
      .mockRejectedValueOnce(new Error());

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
