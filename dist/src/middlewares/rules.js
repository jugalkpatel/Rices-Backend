"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserEligibileForComment = exports.validateRemoveVote = exports.isUserEligibleForVote = exports.isRefreshTokenValid = exports.isAuthenticated = void 0;
const graphql_shield_1 = require("graphql-shield");
const apollo_server_errors_1 = require("apollo-server-errors");
const utils_1 = require("../utils");
var Type;
(function (Type) {
    Type[Type["UPVOTE"] = 0] = "UPVOTE";
    Type[Type["DOWNVOTE"] = 1] = "DOWNVOTE";
})(Type || (Type = {}));
exports.isAuthenticated = (0, graphql_shield_1.rule)()(async (_parent, _args, ctx, _info) => {
    let decodedToken;
    const { request, prisma } = ctx;
    // const accessToken = request.cookies["access"];
    const accessToken = request.cookies[utils_1.CookieNames.ACCESS];
    if (!accessToken) {
        return new apollo_server_errors_1.AuthenticationError("token not found!");
    }
    try {
        decodedToken = (0, utils_1.verifyAccessToken)(accessToken);
    }
    catch (error) {
        throw new utils_1.TokenError("token expired");
    }
    const user = await prisma.user.findUnique({
        where: { id: decodedToken.user },
    });
    if (!user || !user.id) {
        return new Error("user not found!");
    }
    ctx.userId = user.id;
    return true;
});
exports.isRefreshTokenValid = (0, graphql_shield_1.rule)()(async (_parent, _args, ctx, _info) => {
    let decodedToken;
    const { prisma, request, response } = ctx;
    // const refreshToken = request.cookies["refresh"];
    const refreshToken = request.cookies[utils_1.CookieNames.REFRESH];
    if (!refreshToken) {
        return new apollo_server_errors_1.AuthenticationError("refresh token not found!");
    }
    try {
        decodedToken = (0, utils_1.verifyRefreshToken)(refreshToken);
    }
    catch (error) {
        (0, utils_1.clearTokens)(response);
        throw new utils_1.TokenError("refresh token expired");
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
});
exports.isUserEligibleForVote = (0, graphql_shield_1.rule)()(async (_parent, args, context, _info) => {
    const { userId } = context;
    const { data } = args;
    if (!data || !data.communityId || !data.postId || !data.type || !userId) {
        throw new Error("error while parsing inputs");
    }
    return await (0, utils_1.checkUserEligibility)({
        data: { communityId: data.communityId, postId: data.postId, userId },
        context,
    });
});
exports.validateRemoveVote = (0, graphql_shield_1.rule)()(async (parent, args, context, _info) => {
    const { communityId, postId } = args;
    const { userId } = context;
    if (!communityId || !postId || !userId) {
        throw new Error("error while parsing inputs");
    }
    return await (0, utils_1.checkUserEligibility)({
        data: { communityId, postId, userId },
        context,
    });
});
exports.isUserEligibileForComment = (0, graphql_shield_1.rule)()(async (parent, args, context, _info) => {
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
        const { community: { id: communityId }, } = post;
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
});
//# sourceMappingURL=rules.js.map