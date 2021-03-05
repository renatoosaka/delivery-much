export default {
  RABBIT_MQ_HOST: process.env.RABBIT_MQ_HOST || 'localhost',
  RABBIT_MQ_USER: process.env.RABBIT_MQ_USER || 'guest',
  RABBIT_MQ_PASS: process.env.RABBIT_MQ_PASS || 'guest',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/delivery-much',
  HTTP_PORT: process.env.PORT ?? 5000,
};
