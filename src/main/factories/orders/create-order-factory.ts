import { Controller } from '../../../presentation/protocols/controller-protocol';
import { CreateOrderUseCase } from '../../../usecases/orders/create-order-usecase';
import { OrderMongoRepository } from '../../../data/repository/mongodb/order-mongo-repository';
import { ProductMongoRepository } from '../../../data/repository/mongodb/product-mongo-repository';
import { CreateOrderController } from '../../../presentation/controllers/orders/create-order-controller';

export const createOrderControllerFactory = (): Controller => {
  const productRepository = new ProductMongoRepository();
  const orderRepository = new OrderMongoRepository();
  const createOrder = new CreateOrderUseCase(
    productRepository,
    orderRepository,
  );

  return new CreateOrderController(createOrder);
};
