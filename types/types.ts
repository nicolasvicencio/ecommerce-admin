import { ObjectId } from "mongodb";

export type ProductType = {
  _id?: string;
  title: string;
  category: string;
  description?: string;
  price: number | string;
  images: string[];
};

export type CategoryType = {
  _id: ObjectId;
  name: string;
  parent: CategoryType;
  createdAt: string;
  updatedAt: string;
  _v: number;
};

export type PropertyType = {
  name: string;
  values: string;
};
