import ImageKit from "@imagekit/nodejs";
import { Config } from "../config/env.js";

const client = new ImageKit({
  privateKey: Config.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  const result = await client.upload({
    file: await ImageKit.toFile(buffer),
    fileName,
    folder,
  });

  return result;
}
