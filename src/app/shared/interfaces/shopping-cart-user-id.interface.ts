export interface ShoppingCartUserID {
  userId: string;
  shoppingCart: {
    cartItemID: string | null,
    productID: string
  } [];
  shoppingCartItems: {
    cartItemId: string
    desc: {
      gender: string,
      size: number
    }
    imageURL: string
    name: string
    price: number
  } [] ;

}
