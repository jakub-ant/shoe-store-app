const API_KEY = 'AIzaSyAEwYFImEhIdUWl-xrVal5Zng-ALnQaInc'
 
export const environment = {
  production: false,
  API_KEY: 'AIzaSyAEwYFImEhIdUWl-xrVal5Zng-ALnQaInc',
  signUpLink:`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
  logInLink: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
  dbShoe: 'https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes',
  dbShoppingCarts: 'https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts',
  dbOrders: 'https://shoe-store-d0b41-default-rtdb.firebaseio.com/orders'
};