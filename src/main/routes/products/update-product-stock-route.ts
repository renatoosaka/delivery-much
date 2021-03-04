import { Router } from 'express';
import { updateProductStockControllerFactory } from '../../factories/products';
import { expressRouteAdapter } from '../../adapters/express-route-adapter';

export const updateProductStockRoute = (router: Router): void => {
  router.patch(
    '/products/:name',
    expressRouteAdapter(updateProductStockControllerFactory()),
  );
};
