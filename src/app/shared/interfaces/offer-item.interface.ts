export interface OfferItem {
  id: string;
  name: string;
  desc: {
    gender: string,
    size: number
  };
  price: number;
  availableItems: number;
  imageURL: string;
}