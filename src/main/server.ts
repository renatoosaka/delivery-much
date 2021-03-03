import env from './config/env';
import { MongoDB } from '../infra/database/mongo';

MongoDB.connect(env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.HTTP_PORT, () =>
      console.log(`http server running on port ${env.HTTP_PORT}`),
    );
  })
  .catch(console.error);
