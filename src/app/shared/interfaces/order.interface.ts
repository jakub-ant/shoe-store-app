import { ShoppingCartUserID } from "./shopping-cart-user-id.interface";

export interface Order extends ShoppingCartUserID{
    date:Date;
    orderId?:string;
}