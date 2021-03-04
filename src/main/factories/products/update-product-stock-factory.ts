import { Controller } from '../../../presentation/protocols/controller-protocol';
import { ProductMongoRepository } from '../../../data/repository/mongodb/product-mongo-repository';
import { UpdateProductStockUseCase } from '../../../usecases/products/update-product-stock-usecase';
import { UpdateProductStockController } from '../../../presentation/controllers/products/update-product-stock-controller';

export const updateProductStockControllerFactory = (): Controller => {
  const productRepository = new ProductMongoRepository();

  const updateProductStock = new UpdateProductStockUseCase(productRepository);

  return new UpdateProductStockController(updateProductStock);
};
