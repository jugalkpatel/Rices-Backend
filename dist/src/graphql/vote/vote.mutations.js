"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteMutations = void 0;
const nexus_1 = require("nexus");
const vote_types_1 = require("./vote.types");
exports.voteMutations = (0, nexus_1.extendType)({
    type: "Mutation",
    definition: (t) => {
        t.nonNull.field("vote", {
            type: "VoteResponse",
            args: { data: vote_types_1.VoteArgs },
            resolve: async (parent, args, context, info) => {
                try {
                    const { data } = args;
                    if (!data) {
                        return { message: "error while parsing inputs" };
                    }
                    const { communityId, type, postId } = data;
                    const { prisma, userId } = context;
                    const exisingVote = await prisma.vote.findFirst({
                        where: {
                            AND: [
                                {
                                    postId: { equals: postId },
                                    post: { communityId: { equals: communityId } },
                                },
                                {
                                    userId: { equals: userId },
                                },
                            ],
                        },
                    });
                    if (exisingVote && exisingVote.id) {
                        if (exisingVote.type === type) {
                            return { message: "operation not allowed" };
                        }
                        const newType = exisingVote.type === "UPVOTE" ? "DOWNVOTE" : "UPVOTE";
                        const updatedVote = await prisma.vote.update({
                            where: { id: exisingVote.id },
                            data: { type: newType },
                        });
                        return updatedVote;
                    }
                    const newVote = await prisma.vote.create({
                        data: {
                            type,
                            post: { connect: { id: postId } },
                            voteUser: { connect: { id: userId } },
                        },
                    });
                    if (!newVote || !newVote?.id) {
                        return { message: "error while voting the post" };
                    }
                    return newVote;
                }
                catch (error) {
                    console.log({ error });
                    return { message: "unexpected error occurred while voting the post" };
                }
            },
        });
        t.nonNull.field("removeVote", {
            type: "VoteResponse",
            args: {
                postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                voteId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                communityId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, userId } = context;
                    const { postId, voteId } = args;
                    const vote = await prisma.vote.findFirst({
                        where: {
                            AND: [{ id: voteId }, { postId: postId }, { userId: userId }],
                        },
                    });
                    if (!vote || !vote.id) {
                        return { message: "vote does not exist" };
                    }
                    const deletedVote = await prisma.vote.delete({
                        where: { id: voteId },
                    });
                    if (!deletedVote || !deletedVote?.id) {
                        return { message: "error while deleting post" };
                    }
                    return deletedVote;
                }
                catch (error) {
                    console.log({ error });
                    return { message: "unexpected error while removing vote" };
                }
            },
        });
    },
});
//# sourceMappingURL=vote.mutations.js.map