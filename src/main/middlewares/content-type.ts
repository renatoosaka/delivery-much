import { Response, NextFunction } from 'express';

export const contentType = (
  _,
  response: Response,
  next: NextFunction,
): void => {
  response.type('json');

  next();
};
