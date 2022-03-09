import * as jwt from "jsonwebtoken";
import "dotenv/config";

export type AuthTokenPayload = {
  userId: string;
};

export const APP_SECRET = process.env.TOKEN_SECRET as string;

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }

  return jwt.verify(token, APP_SECRET) as unknown as AuthTokenPayload;
}

console.log({ APP_SECRET });
