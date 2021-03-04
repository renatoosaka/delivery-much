import { Either } from '../../shared';
import { RequiredFieldError } from '../errors';
import { OrderData } from '../../domain/entities/orders';

export interface ShowOrder {
  show(id: string): Promise<Either<RequiredFieldError, OrderData | undefined>>;
}
