import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import csvtojson from 'csvtojson';
import { pipeline, Transform } from 'stream';

import env from './config/env';
import { MongoDB } from '../infra/database/mongo';

const pipelineAsync = promisify(pipeline);

const csv_file = path.resolve(__dirname, '..', '..', 'products.csv');

const handleStream = new Transform({
  transform: async (chunk, encoding, cb) => {
    const data = JSON.parse(chunk);

    const collection = await MongoDB.getCollection('products');

    await collection.insertOne(data);

    return cb(null, JSON.stringify(data));
  },
});

(() => {
  MongoDB.connect(env.MONGO_URL)
    .then(async () => {
      const collection = await MongoDB.getCollection('products');

      const count = await collection.count();

      if (count === 0) {
        await pipelineAsync([
          fs.createReadStream(csv_file),
          csvtojson(),
          handleStream,
        ]);
      }
    })
    .finally(async () => {
      await MongoDB.disconnect();
    });
})();
