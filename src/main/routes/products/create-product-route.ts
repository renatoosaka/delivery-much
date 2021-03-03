import { Router } from 'express';
import { createProductControllerFactory } from '../../factories/products';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const createProductRoute = (router: Router): void => {
  router.post(
    '/products',
    expressRouteAdapter(createProductControllerFactory()),
  );
};
