import { ServerError } from '../../errors';
import { HTTPResponse } from '../../protocols/http-protocol';
import { ok, serverError } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller-protocol';
import { ShowAllOrders } from '../../../usecases/protocols/show-all-order-protocol';

export class ShowAllOrdersController implements Controller {
  constructor(private readonly showAllOrders: ShowAllOrders) {}

  async handle(): Promise<HTTPResponse> {
    try {
      const orders = await this.showAllOrders.all();

      return ok(orders);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
