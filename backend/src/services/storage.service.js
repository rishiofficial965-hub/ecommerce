import ImageKit from "@imagekit/nodejs";
import { Config } from "../config/env.js";

const client = new ImageKit({
  publicKey: Config.IMAGEKIT_PUBLIC_KEY,
  privateKey: Config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: Config.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile({ buffer, fileName, folder = "snitch" }) {
  const result = await client.files.upload({
    file: await ImageKit.toFile(buffer, fileName),
    fileName,
    folder,
  });

  return result;
}
