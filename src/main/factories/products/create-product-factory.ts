import { ProductMongoRepository } from '../../../data/repository/mongodb/product-mongo-repository';
import { CreateProductController } from '../../../presentation/controllers/products/create-product-controller';
import { Controller } from '../../../presentation/protocols/controller-protocol';
import { CreateProductUseCase } from '../../../usecases/products/create-product-usecase';

export const createProductControllerFactory = (): Controller => {
  const productRepository = new ProductMongoRepository();
  const createProduct = new CreateProductUseCase(productRepository);

  return new CreateProductController(createProduct);
};
