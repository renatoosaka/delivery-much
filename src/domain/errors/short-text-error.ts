export class ShortTextError extends Error {
  constructor(field: string, min_chars: number) {
    super(`the ${field} must be greather than ${min_chars} characters`);
    this.name = 'ShortTextError';
  }
}
