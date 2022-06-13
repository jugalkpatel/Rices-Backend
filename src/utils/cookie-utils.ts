import { Response, CookieOptions } from "express";

import { buildTokens } from "../utils";

export enum CookieNames {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export function setCookies(
  res: Response,
  userId: string,
  tokenVersion: number
) {
  try {
    const { accessToken, refreshToken } = buildTokens(userId, tokenVersion);
    console.log({ accessToken, refreshToken });
    res.cookie(CookieNames.ACCESS, accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    });

    res.cookie(CookieNames.REFRESH, refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
    });

    console.log(res.cookie);
  } catch (error) {
    console.log({ error });
  }
}

export function clearTokens(res: Response) {
  res.cookie(CookieNames.ACCESS, "", { ...cookieOptions, maxAge: 0 });
  res.cookie(CookieNames.REFRESH, "", { ...cookieOptions, maxAge: 0 });
}
