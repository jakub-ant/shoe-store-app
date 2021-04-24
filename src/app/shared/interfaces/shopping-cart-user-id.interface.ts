import { ShoppingCartItem } from "./shopping-cart-item.interface";
import { ShoppingCart } from "./shopping-cart.interface";

 export interface ShoppingCartUserID {
  userId: string;
  shoppingCart: ShoppingCart[];
  shoppingCartItems: ShoppingCartItem [];
}
 