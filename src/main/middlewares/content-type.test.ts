import request from 'supertest';
import app from '../config/app';

describe('#Content-TypeMiddleware', () => {
  it('should return default content-type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.status(200).send('');
    });

    await request(app).get('/test-content-type').expect('content-type', /json/);
  });

  it('should return content-type as xml when forced', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml');
      res.status(200).send('');
    });

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/);
  });
});
