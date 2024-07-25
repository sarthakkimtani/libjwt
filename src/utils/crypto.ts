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

export async function sign(input: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const keyData = encoder.encode(secret);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);

  const base64String = Buffer.from(signature).toString("base64");
  return base64String.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
