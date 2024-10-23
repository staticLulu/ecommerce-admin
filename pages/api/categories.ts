import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req:NextApiRequest, res:NextApiResponse) {
  const {method} = req;
  await mongooseConnect();

  //GET
  if(method === 'GET') {
    // GET: Fetch products or a single product by id
    if (req.query?.id) {
      res.json(await Category.findOne({_id:req.query?.id}));
    } else {
      res.json(await Category.find().populate('parent'));
    }
  }

  else if(method === 'POST') {
    const { name, parentCategory, properties } = req.body;

    try {
      const categoryDoc = await Category.create({
        name, 
        parent:parentCategory || undefined,
        properties,
      });
      res.status(201).json(categoryDoc);
    } catch (err) {
      res.status(500).json({ error: 'Error creating category', details: err });
    }
  }

  else if (method === 'PUT') {
    const { name, parentCategory, properties, _id } = req.body;

    try {
      await Category.updateOne({_id},{
        name, 
        parent:parentCategory || undefined,
        properties
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Error creating category', details: err });
    }
  }

  else if (method === 'DELETE') {
    try {
      const  { _id } = req.query;
      await Category.deleteOne({_id});
      res.json({success: true});
    } catch (err) {
      res.status(500).json({ error: 'Error deleting category', details: err });
    }
  }

  // else if (method === 'DELETE') {
  //   try {
  //     const { _id } = req.query;
  
  //     // Check if _id is provided
  //     if (!_id) {
  //       return res.status(400).json({ error: 'Category ID is required' });
  //     }
  
  //     // Attempt to delete the category
  //     const result = await Category.deleteOne({ _id });
      
  //     // Check if the deletion was successful
  //     if (result.deletedCount === 0) {
  //       return res.status(404).json({ error: 'Category not found' });
  //     }
  
  //     res.json({ success: true });
  //   } catch (err: any) {
  //     console.error(err); // Log the error for debugging
  //     res.status(500).json({ error: 'Error deleting category', details: err.message });
  //   }
  // }
  

  else {
    // Return 405 for unsupported methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}