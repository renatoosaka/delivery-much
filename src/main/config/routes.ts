import { Express, Router } from 'express';
import { createProductRoute, showProductRoute } from '../routes/products';

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
};
