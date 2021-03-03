export class ProductNotFoundError extends Error {
  constructor(product: string) {
    super(`the ${product} does not found`);
    this.name = 'ProductNotFoundError';
  }
}
