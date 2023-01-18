"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function checkUserEligibility({ data, context: { prisma }, }) {
    const { communityId, postId, userId } = data;
    const isUserPartOfCommunity = await prisma.user.findFirst({
        where: {
            AND: [
                { id: userId },
                {
                    joinedCommunities: { some: { id: { equals: communityId } } },
                },
            ],
        },
    });
    if (!isUserPartOfCommunity || !isUserPartOfCommunity?.id) {
        throw new Error("user is not part of a community");
    }
    const validatePost = await prisma.post.findFirst({
        where: {
            id: postId,
        },
    });
    if (!validatePost || !validatePost?.id) {
        throw new Error("invalid post");
    }
    return true;
}
exports.default = checkUserEligibility;
//# sourceMappingURL=checkUserEligibility.js.map