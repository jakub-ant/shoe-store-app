export class ShoppingCartUserID {
  userId!: string;
  shoppingCart: {
    cartItemID: string | null,
    productID: string
  } [] = [];
  shoppingCartItems: {
    cartItemId: string
    desc: {
      gender: string,
      size: number
    }
    imageURL: string
    name: string
    price: number
  } [] = [];
  constructor(userId: string) {
    this.userId = userId
  }
}
