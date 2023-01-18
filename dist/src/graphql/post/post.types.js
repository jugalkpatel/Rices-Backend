"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchPostsResponse = exports.FilterType = exports.BatchPosts = exports.PostResponse = exports.Post = void 0;
const nexus_1 = require("nexus");
exports.Post = (0, nexus_1.objectType)({
    name: "Post",
    isTypeOf: (data) => {
        const isTypeValid = "content" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.string("title");
        t.nonNull.string("content");
        t.nonNull.dateTime("createdAt");
        t.field("community", {
            type: "Community",
            resolve: (parent, args, context, info) => {
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .community();
            },
        });
        t.field("postedBy", {
            type: "User",
            resolve: (parent, args, context, info) => {
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.list.field("bookmarkedBy", {
            type: "User",
            resolve: (parent, args, context, info) => {
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .bookmarkedBy();
            },
        });
        t.list.field("comments", {
            type: "Comment",
            resolve: (parent, args, context, info) => {
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .comments();
            },
        });
        t.nonNull.list.field("votes", {
            type: "Vote",
            resolve: (parent, args, context, info) => {
                return context.prisma.post
                    .findUnique({ where: { id: parent.id } })
                    .votes();
            },
        });
    },
});
exports.PostResponse = (0, nexus_1.unionType)({
    name: "PostResponse",
    definition: (t) => {
        t.members("Post", "CommonError");
    },
});
exports.BatchPosts = (0, nexus_1.objectType)({
    name: "BatchPosts",
    isTypeOf: (data) => {
        const isTypeValid = "cursorId" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("cursorId");
        t.list.field("posts", {
            type: "Post",
        });
    },
});
exports.FilterType = (0, nexus_1.enumType)({
    name: "FilterType",
    members: ["TOP", "NEW"],
});
exports.BatchPostsResponse = (0, nexus_1.unionType)({
    name: "BatchPostsResponse",
    definition: (t) => {
        t.members("BatchPosts", "CommonError");
    },
});
//# sourceMappingURL=post.types.js.map