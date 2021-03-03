export default {
  MONGO_URL:
    process.env.MONGO_URL || 'mongodb://localhost:27017/delivery-much',
  HTTP_PORT: process.env.PORT ?? 5000,
};
