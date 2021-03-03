export class ProductNotFoundError extends Error {
  constructor(name: string) {
    super(`The product with name ${name} does not found`);
    this.name = 'ProductNotFoundError';
  }
}
