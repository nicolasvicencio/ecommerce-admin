import { ObjectId } from "mongodb";

export type ProductType = {
  _id?: string;
  title: string;
  category: string;
  description?: string;
  properties: PropertyType[];
  price: number | string;
  images: string[];
};

export type CategoryType = {
  _id: ObjectId;
  name: string;
  parent: CategoryType;
  properties: PropertyType[];
  createdAt: string;
  updatedAt: string;
  _v: number;
};

export type PropertyType = {
  name: string;
  values: string;
};
export interface CategoryHandlerParams {
  index: number;
  property: PropertyType;
  newValue: string;
}
