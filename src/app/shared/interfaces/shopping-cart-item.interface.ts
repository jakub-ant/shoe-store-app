import { Desc } from "./desc.interface";

export interface ShoppingCartItem {
  cartItemId: string;
  desc: Desc;
  imageURL: string;
  name: string;
  price: number;
}

