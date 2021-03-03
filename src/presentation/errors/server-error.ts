export class ServerError extends Error {
  constructor(reason?: string) {
    super('Internal Server Error');

    this.name = 'ServerError';
    this.stack = reason;
  }
}
