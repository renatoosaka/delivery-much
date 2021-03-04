import { OrderNotFoundError, ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { ShowOrder } from '../../../usecases/protocols/show-order-protocol';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '../../helpers/http-helpers';

export class ShowOrderController implements Controller {
  constructor(private readonly showOrder: ShowOrder) {}

  async handle({ params }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { id = '' } = params;

      const orderOrError = await this.showOrder.show(id);

      if (orderOrError.isLeft()) {
        return badRequest(orderOrError.value);
      }

      if (!orderOrError.value) {
        return notFound(new OrderNotFoundError(id));
      }

      return ok(orderOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
