import { ShowOrderUseCase } from '../../../usecases/orders/show-order-usecase';
import { Controller } from '../../../presentation/protocols/controller-protocol';
import { OrderMongoRepository } from '../../../data/repository/mongodb/order-mongo-repository';
import { ShowOrderController } from '../../../presentation/controllers/orders/show-order-controller';

export const showOrderControllerFactory = (): Controller => {
  const orderRepository = new OrderMongoRepository();
  const showOrder = new ShowOrderUseCase(orderRepository);

  return new ShowOrderController(showOrder);
};
