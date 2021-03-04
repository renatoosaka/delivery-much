import faker from 'faker';
import { MongoDB } from '../../../infra/database/mongo';
import { ProductMongoRepository } from './product-mongo-repository';
import { CreateProductDTO } from '../../../usecases/protocols/create-product-protocols';

const makeSut = (): ProductMongoRepository => {
  return new ProductMongoRepository();
};

const makeValidCreateData = (): CreateProductDTO => ({
  name: faker.name.findName(),
  price: faker.random.number({ min: 1 }),
  quantity: faker.random.number({ min: 1 }),
});

describe('#ProductMongoRepository', () => {
  beforeAll(async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoDB.disconnect();
  });

  it('should return a product on success', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    const product = await sut.add(createDataDTO);

    expect(product).toBeTruthy();
    expect(product.id).toBeTruthy();
    expect(product.name).toEqual(createDataDTO.name);
    expect(product.price).toEqual(createDataDTO.price);
    expect(product.quantity).toEqual(createDataDTO.quantity);
  });

  it('should return a product with existing name', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    await sut.add(createDataDTO);

    const product = await sut.find(createDataDTO.name);

    expect(product).toBeTruthy();
    expect(product?.id).toBeTruthy();
    expect(product?.name).toEqual(createDataDTO.name);
    expect(product?.price).toEqual(createDataDTO.price);
    expect(product?.quantity).toEqual(createDataDTO.quantity);
  });

  it('should increase product quantity', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    await sut.add(createDataDTO);

    const product = await sut.find(createDataDTO.name);

    expect(product).toBeTruthy();
    expect(product?.id).toBeTruthy();
    expect(product?.quantity).toEqual(createDataDTO.quantity);

    await sut.updateQuantity(product?.id as string, 1, 'increase');

    const updated_product = await sut.find(createDataDTO.name);

    expect(updated_product).toBeTruthy();
    expect(updated_product?.id).toEqual(product?.id);
    expect(updated_product?.quantity).toEqual(createDataDTO.quantity + 1);
  });

  it('should decrease product quantity', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    await sut.add(createDataDTO);

    const product = await sut.find(createDataDTO.name);

    expect(product).toBeTruthy();
    expect(product?.id).toBeTruthy();
    expect(product?.quantity).toEqual(createDataDTO.quantity);

    await sut.updateQuantity(product?.id as string, 1, 'decrease');

    const updated_product = await sut.find(createDataDTO.name);

    expect(updated_product).toBeTruthy();
    expect(updated_product?.id).toEqual(product?.id);
    expect(updated_product?.quantity).toEqual(createDataDTO.quantity - 1);
  });
});
