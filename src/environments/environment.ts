// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
