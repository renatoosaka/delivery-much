export class RequiredValueError extends Error {
  constructor(field: string) {
    super(`the ${field} is required`);
    this.name = 'RequiredValueError';
  }
}
