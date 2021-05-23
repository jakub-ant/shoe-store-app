export interface User {
  displayName: string;
  email: string;
  expiresIn: string;
  validTill: Date | string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered: boolean;
  shoppingCart: string[];
}