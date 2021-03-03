import { ProductNotFoundError, ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { ShowProduct } from '../../../usecases/protocols/show-product-protocol';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '../../helpers/http-helpers';

export class ShowProductController implements Controller {
  constructor(private readonly showProduct: ShowProduct) {}

  async handle({ params }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { name = '' } = params;

      const productOrError = await this.showProduct.show(name);

      if (productOrError.isLeft()) {
        return badRequest(productOrError.value);
      }

      if (!productOrError.value) {
        return notFound(new ProductNotFoundError(name));
      }

      return ok(productOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
