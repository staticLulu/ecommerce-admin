import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Orders";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongooseConnect();
  res.json(await Order.find().sort({createdAt: -1}));
}