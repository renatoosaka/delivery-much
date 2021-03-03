import { ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { badRequest, created, serverError } from '../../helpers/http-helpers';
import { CreateOrder } from '../../../usecases/protocols/create-order-protocol';

export class CreateOrderController implements Controller {
  constructor(private readonly createOrder: CreateOrder) {}

  async handle({ body }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { products } = body;

      const orderOrError = await this.createOrder.create({
        products,
      });

      if (orderOrError.isLeft()) {
        return badRequest(orderOrError.value);
      }

      return created(orderOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
