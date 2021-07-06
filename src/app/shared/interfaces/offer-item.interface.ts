import { Desc } from "./desc.interface";

export interface OfferItem {
  id: string;
  name: string;
  desc: Desc;
  price: number;
  availableItems: number;
  imageURL: string;
}