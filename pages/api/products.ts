import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await mongooseConnect();

  //GET
  if(method === 'GET') {
    res.json(await Product.find());
  }

  //POST
  if (method === 'POST') {
    // Destructure from req.body, not res.body
    const { title, description, price } = req.body;

    try {
      // Create the product document
      const productDoc = await Product.create({
        title, 
        description, 
        price
      });

      // Send a response with the created product
      res.status(201).json(productDoc);
    } catch (error) {
      // Handle errors (e.g., missing fields or database issues)
      res.status(500).json({ error: 'Error creating product', details: error });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).json({ error: 'Method not allowed' });
  }
}
