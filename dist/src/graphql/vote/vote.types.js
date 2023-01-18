"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteResponse = exports.VoteArgs = exports.Vote = exports.VoteType = void 0;
const nexus_1 = require("nexus");
exports.VoteType = (0, nexus_1.enumType)({
    name: "VoteType",
    members: ["UPVOTE", "DOWNVOTE"],
});
exports.Vote = (0, nexus_1.objectType)({
    name: "Vote",
    isTypeOf: (data) => {
        const isTypeValid = "type" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.field("type", { type: exports.VoteType });
        t.nonNull.dateTime("createdAt");
        t.field("voteUser", {
            type: "User",
            resolve: (parent, args, context, info) => {
                return context.prisma.vote
                    .findUnique({ where: { id: parent.id } })
                    .voteUser();
            },
        });
        t.field("post", {
            type: "Post",
            resolve: (parent, args, context, info) => {
                return context.prisma.vote
                    .findUnique({ where: { id: parent.id } })
                    .post();
            },
        });
    },
});
exports.VoteArgs = (0, nexus_1.inputObjectType)({
    name: "VoteArgs",
    definition: (t) => {
        t.nonNull.field("type", { type: exports.VoteType });
        t.nonNull.string("postId");
        t.nonNull.string("communityId");
    },
});
exports.VoteResponse = (0, nexus_1.unionType)({
    name: "VoteResponse",
    definition: (t) => {
        t.members("Vote", "CommonError");
    },
});
//# sourceMappingURL=vote.types.js.map