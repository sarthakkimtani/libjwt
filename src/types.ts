export interface JWTPayload {
  id: string | number;
  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  [key: string]: any;
}

export interface DecodedJWT {
  id: string | number;
  payload: JWTPayload;
  expires_at?: Date;
}
