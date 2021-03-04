import { ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { badRequest, ok, serverError } from '../../helpers/http-helpers';
import { UpdateProductStock } from '../../../usecases/protocols/update-product-stock-protocol';

export class UpdateProductStockController implements Controller {
  constructor(private readonly updateProductStock: UpdateProductStock) {}

  async handle({ body, params }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { name = '' } = params;
      const { quantity = 0, operation = '' } = body;

      const productOrError = await this.updateProductStock.update({
        name,
        quantity,
        operation,
      });

      if (productOrError.isLeft()) {
        return badRequest(productOrError.value);
      }

      return ok(productOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
