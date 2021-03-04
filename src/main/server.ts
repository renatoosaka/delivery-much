import amqp from 'amqplib/callback_api';
import env from './config/env';
import { MongoDB } from '../infra/database/mongo';

MongoDB.connect(env.MONGO_URL)
  .then(async () => {
    const app = (await import('./config/app')).default;

    app.listen(env.HTTP_PORT, () =>
      console.log(`http server running on port ${env.HTTP_PORT}`),
    );

    amqp.connect('amqp://guest:guest@localhost', (errConn, conn) => {
      if (errConn) {
        console.error('Error on connecting RabbitMQ', errConn);
        return;
      }

      console.log('AMPQ Connected');

      conn.createChannel((errChan, channel) => {
        if (errChan) {
          console.error('Error on create channel', errChan);
          return;
        }

        channel.assertExchange('stock', 'direct', { durable: true });

        channel.assertQueue('', { exclusive: true }, (errQueue, q) => {
          if (errQueue) {
            console.error('Error on asserting queue', errQueue);
            return;
          }

          channel.bindQueue(q.queue, 'stock', 'incremented');
          channel.bindQueue(q.queue, 'stock', 'decremented');

          channel.consume(
            q.queue,
            msg => {
              console.log(
                " [x] %s: '%s'",
                msg?.fields.routingKey,
                msg?.content.toString(),
              );
            },
            {
              noAck: true,
            },
          );
        });
      });
    });
  })
  .catch(console.error);
