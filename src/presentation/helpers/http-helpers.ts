import { UnauthorizedError, ServerError } from '../errors';

import { HTTPResponse } from '../protocols/http-protocol';

export const badRequest = (error: Error): HTTPResponse => ({
  status_code: 400,
  body: error,
});

export const unauthorized = (): HTTPResponse => ({
  status_code: 401,
  body: new UnauthorizedError(),
});

export const forbidden = (error: Error): HTTPResponse => ({
  status_code: 403,
  body: error,
});

export const notFound = (data: any): HTTPResponse => ({
  status_code: 404,
  body: data,
});

export const serverError = (error: Error): HTTPResponse => ({
  status_code: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HTTPResponse => ({
  status_code: 200,
  body: data,
});

export const created = (data: any): HTTPResponse => ({
  status_code: 201,
  body: data,
});
