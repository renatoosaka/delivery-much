import mongodb, { Collection, MongoClient } from 'mongodb';

export const MongoDB = {
  uri: (null as unknown) as string,
  client: (null as unknown) as MongoClient,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await mongodb.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },
  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }

    return this.client.db().collection(name);
  },
};
