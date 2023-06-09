import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "POST") {
    const { categoryName, parentCategory, properties } = req.body;
    const category = await Category.create({
      name: categoryName,
      parent: parentCategory,
      properties,
    });
    res.json(category);
  }

  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    res.json(categories);
  }

  if (method === "PUT") {
    const { categoryName, parentCategory, properties, _id } = req.body;

    const category = await Category.findByIdAndUpdate(_id, {
      name: categoryName,
      parent: parentCategory,
      properties,
    });
    res.json(category);
  }

  if (method === "DELETE") {
    console.log(req.query);
    if (req.query.id) {
      const category = await Category.findByIdAndDelete(req.query.id);
      res.json(category);
    }
  }
}
