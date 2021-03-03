import { Controller } from '../../../presentation/protocols/controller-protocol';
import { ShowProductUseCase } from '../../../usecases/products/show-product-usecase';
import { ProductMongoRepository } from '../../../data/repository/mongodb/product-mongo-repository';
import { ShowProductController } from '../../../presentation/controllers/products/show-product-controller';

export const showProductControllerFactory = (): Controller => {
  const productRepository = new ProductMongoRepository();
  const showProduct = new ShowProductUseCase(productRepository);

  return new ShowProductController(showProduct);
};
