import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse ) {
	const {method} = req
	await mongooseConnect()

	if(method === 'POST') {
		const {title, description, price} = req.body
		const newProduct = await Product.create({title, description, price})
		res.status(200).json(newProduct)
	}

	if(method === 'GET') {
		if(req.query?.id){
			const product = await Product.findById(req.query.id)
			res.json(product)
		}else{
			const productsCollection = await Product.find()
			res.json(productsCollection)
		}
	}

	if(method === 'PUT') {
		const {title, description, price, _id} = req.body
		await Product.findByIdAndUpdate(_id, {title, description, price})
		res.json(true)
	}

	if(method === 'DELETE') {
		if(req.query.id) {
			await Product.findByIdAndDelete(req.query.id)
			res.json(true)
		}
	}
}