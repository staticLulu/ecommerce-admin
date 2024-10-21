// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   console.log("HTTP?", method)
//   await mongooseConnect();

//   //GET
//   if(method === 'GET') {
//     if (req.query?.id) {
//       res.json(await Product.findOne({_id:req.query?.id}));
//     } else {
//       res.json(await Product.find());
//     }
//   }

//   //POST
//   if (method === 'POST') {
//     // Destructure from req.body, not res.body
//     const { title, description, price } = req.body;

//     try {
//       // Create the product document
//       const productDoc = await Product.create({
//         title, 
//         description, 
//         price
//       });

//       // Send a response with the created product
//       res.status(201).json(productDoc);
//     } catch (error) {
//       // Handle errors (e.g., missing fields or database issues)
//       res.status(500).json({ error: 'Error creating product', details: error });
//     }
//   } else {
//     // Handle other HTTP methods if needed
//     res.status(405).json({ error: 'Method not allowed' });
//   }

//   //PUT
//   if (method === 'PUT') {
//     const { title, description, price, _id} = req.body;
//     await Product.updateOne({_id}, {title, description, price});
//     res.json(true);
//   }

//   //DELETE
//   if (method === 'DELETE') {
//     console.log("id in delete?", req.query?.id)
//     if (req.query?.id) {
//       await Product.deleteOne({_id:req.query?.id});
//       res.json(true);
//     }
//   }
// }

import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  console.log("HTTP?", method)
  await mongooseConnect();

  if (method === 'GET') {
    // GET: Fetch products or a single product by id
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query?.id }));
    } else {
      res.json(await Product.find());
    }
  } 
  else if (method === 'POST') {
    // POST: Create a new product
    const { title, description, price } = req.body;

    try {
      const productDoc = await Product.create({ title, description, price });
      res.status(201).json(productDoc);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product', details: error });
    }
  }
  else if (method === 'PUT') {
    // PUT: Update a product by id
    const { title, description, price, _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Product ID is required for update' });
    }

    try {
      await Product.updateOne({ _id }, { title, description, price });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error updating product', details: error });
    }
  }
  else if (method === 'DELETE') {
    // DELETE: Delete a product by id
    if (!req.query?.id) {
      return res.status(400).json({ error: 'Product ID is required for deletion' });
    }

    try {
      await Product.deleteOne({ _id: req.query.id });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product', details: error });
    }
  } 
  else {
    // Return 405 for unsupported methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}
