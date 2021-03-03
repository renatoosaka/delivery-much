import { Router } from 'express';
import { showProductControllerFactory } from '../../factories/products';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const showProductRoute = (router: Router): void => {
  router.get(
    '/products/:name',
    expressRouteAdapter(showProductControllerFactory()),
  );
};
