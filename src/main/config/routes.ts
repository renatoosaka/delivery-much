import { Express, Router } from 'express';
import {
  createProductRoute,
  showProductRoute,
  updateProductStockRoute,
} from '../routes/products';
import {
  createOrderRoute,
  showOrderRoute,
  showAllOrdersRoute,
} from '../routes/orders';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  router.get('/', (_, response) => {
    return response.json({
      message: 'Hello world',
    });
  });

  createProductRoute(router);
  showProductRoute(router);
  updateProductStockRoute(router);

  createOrderRoute(router);
  showAllOrdersRoute(router);
  showOrderRoute(router);
};
