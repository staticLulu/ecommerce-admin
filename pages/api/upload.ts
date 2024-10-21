import { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const form = new multiparty.Form();
  const {fields, files}: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields, files});
     
    });
  });
  console.log("length", files.file.length);
  console.log(fields);
  
  return res.json('ok');
}

export const config = {
  api: { bodyParser: false},
}
