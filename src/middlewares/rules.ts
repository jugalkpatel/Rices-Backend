import { rule } from "graphql-shield";
import * as jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server";

import { Context, AuthTokenPayload } from "types";

const APP_SECRET = process.env.TOKEN_SECRET as string;

const isAuthenticated = rule()(async (parent, args, ctx: Context, info) => {
  const authHeader = ctx.request.headers["authorization"];

  console.log({ authHeader });

  let decodedToken;

  if (!authHeader) {
    return new ApolloError("token not found!");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    decodedToken = jwt.verify(token, APP_SECRET) as unknown as AuthTokenPayload;
  } catch {
    throw new ApolloError("token expired", "TOKEN_EXPIRED");
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: decodedToken.userId },
  });

  if (!user || !user.id) {
    return new Error("user not found!");
  }

  ctx.userId = user.id;

  return true;
});

export default isAuthenticated;
