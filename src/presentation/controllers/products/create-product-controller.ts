import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { badRequest, created, serverError } from '../../helpers/http-helpers';
import { ServerError } from '../../errors';
import { CreateProduct } from '../../../usecases/protocols/create-product-protocols';

export class CreateProductController implements Controller {
  constructor(private readonly createProduct: CreateProduct) {}

  async handle({ body }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { name = '', price = 0, quantity = 0 } = body;

      const productOrError = await this.createProduct.create({
        name,
        price,
        quantity,
      });

      if (productOrError.isLeft()) {
        return badRequest(productOrError.value);
      }

      return created(productOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
