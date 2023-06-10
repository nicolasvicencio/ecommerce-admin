import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  }

  if (method === "GET") {
    const categories = await Category.find();
    res.json(categories);
  }
}
