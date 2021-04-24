export interface ShoppingCartItem {
  cartItemId: string;
  desc: {
    gender: string,
    size: number
  }
  imageURL: string;
  name: string;
  price: number;
}

