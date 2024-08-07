import { encode_jwt, decode_jwt, validate_jwt } from "../index";
import * as cryptoUtils from "../utils/crypto";

describe("JWT Library", () => {
  const secret = "my-secret";
  const payload = { id: "user123", name: "John Doe" };
  const ttl = 900;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("encode_jwt", () => {
    it("Encode correct JWT Structure", async () => {
      const mockHeader = JSON.stringify({ alg: "HS256", typ: "JWT" });
      const mockPayload = JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + ttl,
      });

      jest
        .spyOn(cryptoUtils, "base64UrlEncode")
        .mockImplementation((input) => Buffer.from(input).toString("base64"));
      jest.spyOn(cryptoUtils, "sign").mockResolvedValue("signature");

      const token = await encode_jwt(secret, payload, ttl);

      const [encodedHeader, encodedPayload, signature] = token.split(".");
      expect(encodedHeader).toBe(Buffer.from(mockHeader).toString("base64"));
      expect(encodedPayload).toBe(Buffer.from(mockPayload).toString("base64"));
      expect(signature).toBe("signature");
    });
  });

  describe("decode_jwt", () => {
    it("Decode valid JWT", async () => {
      const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
        "base64"
      );
      const encodedPayload = Buffer.from(
        JSON.stringify({
          ...payload,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + ttl,
        })
      ).toString("base64");
      const signature = "signature";

      jest
        .spyOn(cryptoUtils, "base64UrlDecode")
        .mockImplementation((input) => Buffer.from(input, "base64").toString("utf-8"));
      jest.spyOn(cryptoUtils, "sign").mockResolvedValue("signature");

      const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

      const decoded = await decode_jwt(secret, jwt);

      expect(decoded.payload).toMatchObject(payload);
      expect(decoded.expires_at).toBeInstanceOf(Date);
    });

    it("Error on Invalid JWT Signature", async () => {
      const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
        "base64"
      );
      const encodedPayload = Buffer.from(
        JSON.stringify({
          ...payload,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + ttl,
        })
      ).toString("base64");
      const invalidSignature = "invalid-signature";

      jest
        .spyOn(cryptoUtils, "base64UrlDecode")
        .mockImplementation((input) => Buffer.from(input, "base64").toString("utf-8"));
      jest.spyOn(cryptoUtils, "sign").mockResolvedValue("signature");

      const jwt = `${encodedHeader}.${encodedPayload}.${invalidSignature}`;

      await expect(decode_jwt(secret, jwt)).rejects.toThrow("Invalid JWT signature");
    });
  });

  describe("validate_jwt", () => {
    it("Validate correct JWT", async () => {
      const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
        "base64"
      );
      const encodedPayload = Buffer.from(
        JSON.stringify({
          ...payload,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + ttl,
        })
      ).toString("base64");
      const signature = "signature";

      jest
        .spyOn(cryptoUtils, "base64UrlDecode")
        .mockImplementation((input) => Buffer.from(input, "base64").toString("utf-8"));
      jest.spyOn(cryptoUtils, "sign").mockResolvedValue("signature");

      const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

      const isValid = await validate_jwt(secret, jwt);

      expect(isValid).toBe(true);
    });

    it("Check expired JWT", async () => {
      const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
        "base64"
      );
      const encodedPayload = Buffer.from(
        JSON.stringify({
          ...payload,
          iat: Math.floor(Date.now() / 1000) - 1000,
          exp: Math.floor(Date.now() / 1000) - 500,
        })
      ).toString("base64");
      const signature = "signature";

      jest
        .spyOn(cryptoUtils, "base64UrlDecode")
        .mockImplementation((input) => Buffer.from(input, "base64").toString("utf-8"));
      jest.spyOn(cryptoUtils, "sign").mockResolvedValue("signature");

      const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;

      const isValid = await validate_jwt(secret, jwt);

      expect(isValid).toBe(false);
    });

    it("Check invalid JWT", async () => {
      const invalidJWT = "invalid.jwt.token";

      const isValid = await validate_jwt(secret, invalidJWT);

      expect(isValid).toBe(false);
    });
  });
});
