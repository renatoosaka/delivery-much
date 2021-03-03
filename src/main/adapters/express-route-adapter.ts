import { Request, Response } from 'express';
import { Controller } from '../../presentation/protocols/controller-protocol';
import {
  HTTPRequest,
  HTTPResponse,
} from '../../presentation/protocols/http-protocol';

export const expressRouteAdapter = (controller: Controller) => {
  return async (request: Request, response: Response): Promise<void> => {
    const httpRequest: HTTPRequest = {
      body: request.body,
      params: request.params,
    };

    const httpResponse: HTTPResponse = await controller.handle(httpRequest);

    if (httpResponse.status_code >= 200 && httpResponse.status_code < 400) {
      response.status(httpResponse.status_code).json(httpResponse.body);
    } else {
      response.status(httpResponse.status_code).json({
        error: httpResponse.body.message,
      });
    }
  };
};
