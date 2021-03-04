import { AddProduct } from './add-product';
import { FindProductByName } from './find-product-by-name';
import { UpdateProductQuantity } from './update-product-quantity';

export * from './add-product';
export * from './find-product-by-name';
export * from './update-product-quantity';

export interface ProductRepository
  extends AddProduct,
    FindProductByName,
    UpdateProductQuantity {}
