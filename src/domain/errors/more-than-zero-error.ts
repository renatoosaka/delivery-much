export class MoreThanZeroError extends Error {
  constructor(field: string) {
    super(`the ${field} must be more than zero`);
    this.name = 'MoreThanZeroError';
  }
}
