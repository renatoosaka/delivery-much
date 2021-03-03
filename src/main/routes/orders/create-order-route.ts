import { Router } from 'express';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';
import { createOrderControllerFactory } from '../../factories/orders';

export const createOrderRoute = (router: Router): void => {
  router.post('/orders', expressRouteAdapter(createOrderControllerFactory()));
};
