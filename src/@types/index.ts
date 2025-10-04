export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  name: string;
  email?: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
}
