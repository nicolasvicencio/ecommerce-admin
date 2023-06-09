import { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "@/lib/aws-s3";
import fs from "fs";
//@ts-ignore
import mime from "mime-types";
//@ts-ignore
import multiparty from "multiparty";

const bucketName: string = "ecommerce-nextjs-dev";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new multiparty.Form();

  const { fields, files }: any = await new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  const links = [];
  console.log({ files });
  for (const file of await files.file) {
    const fileExt = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + fileExt;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
