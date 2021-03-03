import request from 'supertest';
import app from '../config/app';

describe('#CorsMiddleware', () => {
  it('Should enable CORS', async () => {
    app.get('/test-cors', (req, res) => {
      res.status(200).send();
    });

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
