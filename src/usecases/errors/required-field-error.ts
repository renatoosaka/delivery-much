export class RequiredFieldError extends Error {
  constructor(field: string) {
    super(`no ${field} was provided`);
    this.name = 'RequiredFieldError';
  }
}
