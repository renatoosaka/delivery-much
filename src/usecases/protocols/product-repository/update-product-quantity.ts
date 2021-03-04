type OperationType = 'increase' | 'decrease';

export interface UpdateProductQuantity {
  updateQuantity(
    id: string,
    quantity: number,
    operation: OperationType,
  ): Promise<void>;
}
