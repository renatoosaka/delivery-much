export class OrderNotFoundError extends Error {
  constructor(id: string) {
    super(`The order with id ${id} does not found`);
    this.name = 'OrderNotFoundError';
  }
}
