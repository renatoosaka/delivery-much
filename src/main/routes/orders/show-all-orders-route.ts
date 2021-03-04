import { Router } from 'express';
import { showAllOrdersControllerFactory } from '../../factories/orders';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const showAllOrdersRoute = (router: Router): void => {
  router.get('/orders', expressRouteAdapter(showAllOrdersControllerFactory()));
};
