import amqp from 'amqplib/callback_api';
import { updateProductStockControllerFactory } from '../factories/products';

export const rabbitMQ = (): void => {
  amqp.connect('amqp://guest:guest@localhost', (errConn, conn) => {
    if (errConn) {
      console.error('Error on connecting RabbitMQ', errConn);
      return;
    }

    const updateProductStockController = updateProductStockControllerFactory();
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
          async msg => {
            if (msg) {
              const name = msg?.content.toString();
              const operation =
                msg?.fields.routingKey === 'incremented'
                  ? 'increase'
                  : 'decrease';
              const quantity = 1;

              const response = await updateProductStockController.handle({
                params: {
                  name,
                },
                body: {
                  quantity,
                  operation,
                },
              });

              if (response.status_code === 200) {
                console.log(
                  "Executed - %s: '%s'",
                  msg?.fields.routingKey,
                  msg?.content.toString(),
                );

                channel.ack(msg);
              }
            }
          },
          {
            noAck: true,
          },
        );
      });
    });
  });
};
