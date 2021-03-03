import { MongoDB } from './mongo';

describe('#MongoDB', () => {
  it('should connect successfully', async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);

    expect(MongoDB.client.isConnected()).toBe(true);

    await MongoDB.disconnect();
  });

  it('should disconnect successfully', async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);

    expect(MongoDB.client.isConnected()).toBe(true);

    await MongoDB.disconnect();

    expect(MongoDB.client).toBeNull();
  });

  it('should return a Collection', async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);

    const collection = await MongoDB.getCollection('collection_test');

    expect(collection).toBeTruthy();

    await MongoDB.disconnect();
  });

  it('should reconnect if not connected when will get a Collection', async () => {
    await MongoDB.connect(process.env.MONGO_URL as string);

    expect(MongoDB.client.isConnected()).toBe(true);

    await MongoDB.disconnect();

    expect(MongoDB.client).toBeNull();

    const collection = await MongoDB.getCollection('collection_test');

    expect(collection).toBeTruthy();
    expect(MongoDB.client.isConnected()).toBe(true);

    await MongoDB.disconnect();
  });
});
