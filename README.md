# libjwt

**libjwt** is a lightweight library for creating and validating JSON Web Tokens (JWT) using the HS256 algorithm. It provides a simple interface for encoding, decoding, and validating JWTs, making it easy to integrate secure authentication into your Node.js applications.

## Features

- **HS256 Algorithm:** Utilizes the HS256 (HMAC with SHA-256) algorithm for JWT signing and verification.
- **Simple API:** Easily encode, decode, and validate JWTs.
- **Custom Payloads:** Supports custom payload data with standard JWT claims like `iat` (issued at) and `exp` (expiration).

## Installation

Install the library using npm:

```bash
npm install @sarthakkimtani/libjwt
```

## Usage

### Importing the Library

To use the library, import the necessary functions:

```javascript
import { encode_jwt, decode_jwt, validate_jwt } from "@sarthakkimtani/libjwt";
```

### Encoding a JWT

Create a JWT with a secret, payload, and an optional time-to-live (TTL) in seconds (default is 900 seconds or 15 minutes):

```javascript
const secret = "your-secret-key";
const payload = { id: "user123", role: "admin" };

const token = encode_jwt(secret, payload, 3600); // TTL is 1 hour
console.log("Generated JWT:", token);
```

### Decoding a JWT

Decode a JWT to extract its payload. The function returns an object containing the `id`, full `payload`, and `expires_at` date:

```javascript
const decoded = decode_jwt(secret, token);
console.log("Decoded JWT:", decoded);
```

### Validating a JWT

Check if a JWT is valid by verifying its signature and expiration. Returns `true` if the token is valid, otherwise `false`:

```javascript
const isValid = validate_jwt(secret, token);
console.log("Is the JWT valid?", isValid);
```

## API Reference

### `encode_jwt(secret: string, payload: JWTPayload, ttl?: number): string`

- **secret**: The secret key used to sign the JWT.
- **payload**: The payload to include in the JWT. This can contain any custom claims.
- **ttl**: Optional. Time-to-live in seconds. Defaults to 900 seconds (15 minutes).

### `decode_jwt(secret: string, jwt: string): DecodedJWT`

- **secret**: The secret key used to sign the JWT.
- **jwt**: The JWT string to decode.

Returns an object containing the decoded `id`, `payload`, and `expires_at` date.

### `validate_jwt(secret: string, jwt: string): boolean`

- **secret**: The secret key used to sign the JWT.
- **jwt**: The JWT string to validate.

Returns `true` if the JWT is valid (correct signature and not expired), otherwise `false`.

## Demo

A demo of this project is available in the `demo` folder. The demo includes practical examples of how to use the library, demonstrating its functionality in real-world scenarios.

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Author

**Sarthak Kimtani**

Feel free to contribute to the project or open issues if you encounter any problems!
