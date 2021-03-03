export class DuplicatedProductsError extends Error {
  constructor() {
    super(`there are duplicated products in the order`);
    this.name = 'DuplicatedProductsError';
  }
}
