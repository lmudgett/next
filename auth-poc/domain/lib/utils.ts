import crypto from "crypto";
import fs from "fs";

export function encryptPassword(password: string) {
  const pathToPubKey = process.env.PUBLIC_KEY_PATH;
  if (!pathToPubKey) {
    throw new Error("key not found");
  }
  const key = fs.readFileSync(pathToPubKey, "utf8");
  const encryptedPassword = crypto
    .publicEncrypt(
      { key: key, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(password)
    )
    .toString("base64");

  return encryptedPassword;
}

export function encryptPasswordforStorage(password: string) {
  const pathToPriKey = process.env.PRIVATE_KEY_PATH;
  if (!pathToPriKey) {
    throw new Error("key not found");
  }
  const key = fs.readFileSync(pathToPriKey, "utf8");
  const encryptedPassword = crypto
    .privateEncrypt(
      {
        key: key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(password)
    )
    .toString("base64");
  return encryptedPassword;
}
