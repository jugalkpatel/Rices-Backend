import * as jwt from "jsonwebtoken";
import "dotenv/config";

import { AccessTokenPayload, RefreshTokenPayload } from "types";

const ACCESS_SECRET = process.env.TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

type IBuildToken = {
  accessToken: string;
  refreshToken: string;
};

// time for tokens: refresh token: 10Days, accessToken: 5 days

// verify token
// if refresh token expirese then clear tokens
// check user presence
// check token version
// compare token version on refresh token with the token version in db
// throw error is version doesn't match otherwise generate a new tokens
// generate a new refresh token if it almost expires

export function signAccessToken(payload: AccessTokenPayload): string {
  // return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5d" });

  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15s" });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  // return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "10d" });
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "1min" });
}

export function buildTokens(id: string, tokenVersion: number): IBuildToken {
  const accessToken = signAccessToken({ user: id });
  const refreshToken = signRefreshToken({ user: id, tokenVersion });

  return { accessToken: accessToken, refreshToken: refreshToken };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as unknown as RefreshTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as unknown as AccessTokenPayload;
}

export function checkTokenVersion(
  tokenVersion: number,
  tokenVersionFromDB: number
): boolean {
  if (tokenVersion === tokenVersionFromDB) {
    return true;
  }

  return false;
}
