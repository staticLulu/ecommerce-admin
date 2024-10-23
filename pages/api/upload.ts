import { NextApiRequest, NextApiResponse } from 'next';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import multiparty from 'multiparty';
import { storage } from '@/config/firebase';
import fs from 'fs';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const form = new multiparty.Form();
  const { fields, files }: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = files.file[0];
  const filename = `${uuidv4()}-${file.originalFilename}`;
  const storageRef = ref(storage, `images/${filename}`);

  try {
    const fileBuffer = await fs.promises.readFile(file.path);
    await uploadBytes(storageRef, fileBuffer);
    const fileURL = await getDownloadURL(storageRef);
    console.log('File uploaded successfully:', fileURL);

    return res.json({ success: true, url: fileURL });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
}

export const config = {
  api: { bodyParser: false },
};
