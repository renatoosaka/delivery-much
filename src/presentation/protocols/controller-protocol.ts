import { HTTPRequest, HTTPResponse } from './http-protocol';

export interface Controller {
  handle(data: HTTPRequest): Promise<HTTPResponse>;
}
