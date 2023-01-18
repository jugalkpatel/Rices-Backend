"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponse = exports.User = void 0;
const nexus_1 = require("nexus");
exports.User = (0, nexus_1.objectType)({
    isTypeOf: (data) => {
        const isTypeValid = "email" in data ? true : false;
        return isTypeValid;
    },
    name: "User",
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.string("picture");
        t.nonNull.int("tokenVersion");
        t.nonNull.dateTime("createdAt");
        t.field("password", {
            type: "Password",
            resolve: (parent, args, context) => {
                return context.prisma.user
                    .findUnique({
                    where: { id: parent.id },
                })
                    .password();
            },
        });
        t.list.nonNull.field("communitiesCreated", {
            type: "Community",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .communitiesCreated();
            },
        });
        t.list.nonNull.field("joinedCommunities", {
            type: "Community",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .joinedCommunities();
            },
        });
        t.list.field("posts", {
            type: "Post",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .posts();
            },
        });
        t.list.field("bookmarks", {
            type: "Post",
            resolve: (parent, args, context, infor) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .bookmarks();
            },
        });
        t.list.field("commentedOn", {
            type: "Comment",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .commentedOn();
            },
        });
        t.list.field("votes", {
            type: "Vote",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .votes();
            },
        });
        t.nonNull.list.field("commentVotes", {
            type: "CommentVote",
            resolve: (parent, args, context, info) => {
                return context.prisma.user
                    .findUnique({ where: { id: parent.id } })
                    .commentVotes();
            },
        });
    },
});
exports.UserResponse = (0, nexus_1.unionType)({
    name: "UserResponse",
    definition: (t) => {
        t.members("User", "CommonError");
    },
});
//# sourceMappingURL=user.types.js.map