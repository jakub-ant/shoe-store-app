export class ShoppingCartUserID {
    userId!: string | number;
    shoppingCart: {
      cartItemID: string | null,
      productID: string
    } [] = [];
    shoppingCartItems: {
      availableItems: number
cartItemId: string
desc: {gender: string, size: number}
imageURL: string
name: string
price: number
    }[] = [];
    constructor(userId: string | number) {
      this.userId = userId
    }
  }