import { Router } from 'express';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';
import { showOrderControllerFactory } from '../../factories/orders';

export const showOrderRoute = (router: Router): void => {
  router.get('/orders/:id', expressRouteAdapter(showOrderControllerFactory()));
};
