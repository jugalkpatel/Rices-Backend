"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMutations = void 0;
const nexus_1 = require("nexus");
const vote_types_1 = require("../vote/vote.types");
exports.CommentMutations = (0, nexus_1.extendType)({
    type: "Mutation",
    definition: (t) => {
        t.nonNull.field("createComment", {
            type: "CommentResponse",
            args: {
                postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                text: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { postId, text } = args;
                    const { prisma, userId } = context;
                    if (!postId || !userId || !text) {
                        return {
                            message: "error while parsing inputs",
                        };
                    }
                    const comment = await prisma.comment.create({
                        data: {
                            text,
                            post: { connect: { id: postId } },
                            user: { connect: { id: userId } },
                            votes: { create: { votedBy: { connect: { id: userId } } } },
                        },
                    });
                    if (!comment?.id) {
                        throw new Error();
                    }
                    return comment;
                }
                catch (error) {
                    console.log({ error });
                    return { message: "unexpected error while creating community!" };
                }
            },
        });
        t.nonNull.field("voteComment", {
            type: "CommentVoteResponse",
            args: {
                type: (0, nexus_1.nonNull)(vote_types_1.VoteType.name),
                commentId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, userId } = context;
                    const { type, commentId } = args;
                    const exisingVote = await prisma.commentVote.findFirst({
                        where: {
                            AND: [
                                { commentId: { equals: commentId } },
                                { userId: { equals: userId } },
                            ],
                        },
                    });
                    if (exisingVote && exisingVote.id) {
                        if (exisingVote.type === type) {
                            return { message: "operation is not allowed" };
                        }
                        const newType = exisingVote.type === "UPVOTE" ? "DOWNVOTE" : "UPVOTE";
                        const updatedVote = await prisma.commentVote.update({
                            where: { id: exisingVote.id },
                            data: { type: newType },
                        });
                        return updatedVote;
                    }
                    const newVote = await prisma.commentVote.create({
                        data: {
                            type,
                            comment: { connect: { id: commentId } },
                            votedBy: { connect: { id: userId } },
                        },
                    });
                    if (!newVote || !newVote?.id) {
                        return { message: "error while voting the post" };
                    }
                    return newVote;
                }
                catch (error) {
                    return { message: "unexpected error occurred while voting comment" };
                }
            },
        });
        t.nonNull.field("removeCommentVote", {
            type: "CommentVoteResponse",
            args: {
                commentId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                voteId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, userId } = context;
                    const { commentId, voteId } = args;
                    console.log({ voteId, commentId, userId });
                    const vote = await prisma.commentVote.findFirst({
                        where: {
                            AND: [
                                { id: voteId },
                                { commentId: commentId },
                                { userId: userId },
                            ],
                        },
                    });
                    if (!vote || !vote.id) {
                        return { message: "vote does not exist" };
                    }
                    const deletedVote = await prisma.commentVote.delete({
                        where: { id: voteId },
                    });
                    if (!deletedVote || !deletedVote?.id) {
                        return { message: "error while deleting comment" };
                    }
                    return deletedVote;
                }
                catch (error) {
                    return {
                        message: "unexpected error occurred while removing comment vote",
                    };
                }
            },
        });
    },
});
//# sourceMappingURL=comment.mutations.js.map