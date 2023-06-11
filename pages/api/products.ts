import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
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
    const { title, description, price, images, category, properties } =
      req.body;
    const newProduct = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.status(200).json(newProduct);
  }

  if (method === "GET") {
    if (req.query?.id) {
      const product = await Product.findById(req.query.id);
      res.json(product);
    } else {
      const productsCollection = await Product.find();
      res.json(productsCollection);
    }
  }

  if (method === "PUT") {
    const { title, description, price, category, properties, _id } = req.body;
    await Product.findByIdAndUpdate(_id, {
      title,
      description,
      price,
      category,
      properties,
    });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query.id) {
      await Product.findByIdAndDelete(req.query.id);
      res.json(true);
    }
  }
}
