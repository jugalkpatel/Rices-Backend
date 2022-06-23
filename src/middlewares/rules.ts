import { rule } from "graphql-shield";
import { AuthenticationError } from "apollo-server-errors";

import { Context, VoteParams } from "types";
import {
  verifyAccessToken,
  verifyRefreshToken,
  TokenError,
  CookieNames,
  clearTokens,
  checkUserEligibility,
} from "../utils";

enum Type {
  UPVOTE,
  DOWNVOTE,
}

type VoteArgs = {
  data: {
    type: Type;
    postId: string;
    communityId: string;
  };
};

type CreateCommentArgs = {
  postId: string;
  text: string;
};

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

export const isUserEligibleForVote = rule()(
  async (_parent, args: VoteArgs, context: Context, _info) => {
    const { userId } = context;
    const { data } = args;

    if (!data || !data.communityId || !data.postId || !data.type || !userId) {
      throw new Error("error while parsing inputs");
    }

    return await checkUserEligibility({
      data: { communityId: data.communityId, postId: data.postId, userId },
      context,
    });
  }
);

export const validateRemoveVote = rule()(
  async (parent, args: VoteParams, context: Context, _info) => {
    const { communityId, postId } = args;
    const { userId } = context;

    if (!communityId || !postId || !userId) {
      throw new Error("error while parsing inputs");
    }

    return await checkUserEligibility({
      data: { communityId, postId, userId },
      context,
    });
  }
);

export const isUserEligibileForComment = rule()(
  async (parent, args: CreateCommentArgs, context: Context, _info) => {
    const { postId, text } = args;
    const { userId, prisma } = context;

    if (!postId || !text) {
      throw new Error("error while parsing inputs");
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { community: { select: { id: true } } },
    });

    if (post) {
      const {
        community: { id: communityId },
      } = post;

      const user = await prisma.user.findFirst({
        where: {
          AND: [
            { id: userId },
            { joinedCommunities: { some: { id: { equals: communityId } } } },
          ],
        },
      });

      if (user && user?.id) {
        return true;
      }
    }

    return false;
  }
);
