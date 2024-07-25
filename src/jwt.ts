import { base64UrlEncode, base64UrlDecode, sign } from "./utils/crypto";
import { JWTPayload, DecodedJWT } from "./types";

export async function encode_jwt(
  secret: string,
  payload: JWTPayload,
  ttl: number = 900
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ttl;
  const fullPayload = { ...payload, iat, exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function decode_jwt(secret: string, jwt: string): Promise<DecodedJWT> {
  const parts = jwt.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  let header, payload;

  try {
    header = JSON.parse(base64UrlDecode(encodedHeader));
    payload = JSON.parse(base64UrlDecode(encodedPayload));
  } catch (e) {
    throw new Error("Invalid JWT encoding");
  }

  if (header.alg !== "HS256") {
    throw new Error("Unsupported JWT algorithm");
  }

  const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, secret);
  if (expectedSignature !== signature) {
    throw new Error("Invalid JWT signature");
  }

  const expires_at = payload.exp ? new Date(payload.exp * 1000) : undefined;
  return {
    id: payload.id,
    payload,
    expires_at,
  };
}

export async function validate_jwt(secret: string, jwt: string): Promise<boolean> {
  try {
    const decoded = await decode_jwt(secret, jwt);
    if (!decoded.expires_at || decoded.expires_at.getTime() < Date.now()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
