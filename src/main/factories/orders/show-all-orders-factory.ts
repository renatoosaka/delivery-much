import { Controller } from '../../../presentation/protocols/controller-protocol';
import { ShowAllOrdersUseCase } from '../../../usecases/orders/show-all-orders-usecase';
import { OrderMongoRepository } from '../../../data/repository/mongodb/order-mongo-repository';
import { ShowAllOrdersController } from '../../../presentation/controllers/orders/show-all-orders-controller';

export const showAllOrdersControllerFactory = (): Controller => {
  const orderRepository = new OrderMongoRepository();
  const showAllOrders = new ShowAllOrdersUseCase(orderRepository);

  return new ShowAllOrdersController(showAllOrders);
};
