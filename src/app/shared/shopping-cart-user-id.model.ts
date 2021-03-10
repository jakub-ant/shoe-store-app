export class ShoppingCartUserID {
    userId!: string | number;
    shoppingCart: {
      cartItemID: string | null,
      productID: string
    } [] = [];
    shoppingCartItems: Object[] = [];
    constructor(userId: string | number) {
      this.userId = userId
    }
  }