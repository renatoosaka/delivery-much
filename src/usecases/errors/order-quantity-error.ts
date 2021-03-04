export class OrderQuantityError extends Error {
  constructor(product: string) {
    super(`the product ${product} does not have enough quantity`);
    this.name = 'OrderQuantityError';
  }
}
