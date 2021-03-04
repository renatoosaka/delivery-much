import { OrderData } from '../../../../domain/entities/orders';

interface ProductOrderMap {
  id: string;
  price: number;
  quantity: number;
}

interface ProductInfoOrderMap {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderMapperDTO {
  _id: string;
  products: ProductOrderMap[];
  products_info: ProductInfoOrderMap[];
}

export const OrderMapper = {
  map(data: OrderMapperDTO): OrderData {
    const products = data.products.map(product => {
      const productInfoIndex = data.products_info.findIndex(
        p => p._id.toString() === product.id.toString(),
      );

      return {
        id: product.id,
        name: data.products_info[productInfoIndex].name,
        price: product.price,
        quantity: product.quantity,
      };
    });

    const total = products.reduce(
      (value, product) => product.price * product.quantity + value,
      0,
    );

    return {
      id: data._id,
      products,
      total,
    };
  },
  mapArray(data: OrderMapperDTO[]): OrderData[] {
    return data.map(item => this.map(item));
  },
};
