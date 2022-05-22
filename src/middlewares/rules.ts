import { rule } from "graphql-shield";
import { AuthenticationError } from "apollo-server-errors";

import { Context } from "types";
import {
  verifyAccessToken,
  verifyRefreshToken,
  TokenError,
  CookieNames,
  clearTokens,
} from "../utils";

export const isAuthenticated = rule()(
  async (_parent, _args, ctx: Context, _info) => {
    let decodedToken;

    const { request, prisma } = ctx;

    // const accessToken = request.cookies["access"];
    const accessToken = request.cookies[CookieNames.ACCESS];

    if (!accessToken) {
      return new AuthenticationError("token not found!");
    }

    try {
      decodedToken = verifyAccessToken(accessToken);
    } catch (error) {
      throw new TokenError("token expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.user },
    });

    if (!user || !user.id) {
      return new Error("user not found!");
    }

    ctx.userId = user.id;

    return true;
  }
);

export const isRefreshTokenValid = rule()(
  async (_parent, _args, ctx: Context, _info) => {
    let decodedToken;

    const { prisma, request, response } = ctx;

    // const refreshToken = request.cookies["refresh"];
    const refreshToken = request.cookies[CookieNames.REFRESH];

    if (!refreshToken) {
      return new AuthenticationError("refresh token not found!");
    }

    try {
      decodedToken = verifyRefreshToken(refreshToken);
    } catch (error) {
      clearTokens(response);
      throw new TokenError("refresh token expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.user },
    });

    if (!user || !user.id) {
      return new Error("user not found!");
    }

    ctx.userId = user.id;
    ctx.tokenVersion = user.tokenVersion;

    return true;
  }
);
