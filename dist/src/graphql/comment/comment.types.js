"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentVoteResponse = exports.CommentReponse = exports.CommentVote = exports.Comment = void 0;
const nexus_1 = require("nexus");
exports.Comment = (0, nexus_1.objectType)({
    name: "Comment",
    isTypeOf: (data) => {
        const isTypeValid = "text" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.string("text");
        t.nonNull.dateTime("createdAt");
        t.field("user", {
            type: "User",
            resolve: (parent, args, context, info) => {
                return context.prisma.comment
                    .findUnique({ where: { id: parent.id } })
                    .user();
            },
        });
        t.field("post", {
            type: "Post",
            resolve: (parent, args, context, info) => {
                return context.prisma.comment
                    .findUnique({ where: { id: parent.id } })
                    .post();
            },
        });
        t.list.field("votes", {
            type: "CommentVote",
            resolve: (parent, args, context, info) => {
                return context.prisma.comment
                    .findUnique({ where: { id: parent.id } })
                    .votes();
            },
        });
    },
});
exports.CommentVote = (0, nexus_1.objectType)({
    name: "CommentVote",
    isTypeOf: (data) => {
        const isTypeValid = "type" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.field("type", { type: "VoteType" });
        t.nonNull.dateTime("createdAt");
        t.field("comment", {
            type: "Comment",
            resolve: (parent, args, context, info) => {
                return context.prisma.commentVote
                    .findUnique({
                    where: { id: parent.id },
                })
                    .comment();
            },
        });
        t.field("votedBy", {
            type: "User",
            resolve: (parent, args, context, info) => {
                return context.prisma.commentVote
                    .findUnique({ where: { id: parent.id } })
                    .votedBy();
            },
        });
    },
});
exports.CommentReponse = (0, nexus_1.unionType)({
    name: "CommentResponse",
    definition: (t) => {
        t.members("Comment", "CommonError");
    },
});
exports.CommentVoteResponse = (0, nexus_1.unionType)({
    name: "CommentVoteResponse",
    definition: (t) => {
        t.members("CommentVote", "CommonError");
    },
});
//# sourceMappingURL=comment.types.js.map