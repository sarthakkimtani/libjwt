import crypto from "crypto";

export function base64UrlEncode(input: string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function base64UrlDecode(input: string): string {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  switch (input.length % 4) {
    case 2:
      input += "==";
      break;
    case 3:
      input += "=";
      break;
  }
  return Buffer.from(input, "base64").toString();
}

export function sign(input: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(input)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
