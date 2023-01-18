"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityResponse = exports.CommunityListResponse = exports.communitylist = exports.community = void 0;
const nexus_1 = require("nexus");
exports.community = (0, nexus_1.objectType)({
    name: "Community",
    isTypeOf: (data) => {
        const isTypeValid = "description" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("id");
        t.nonNull.string("title");
        t.nonNull.string("banner");
        t.nonNull.string("description");
        t.nonNull.string("picture");
        t.nonNull.dateTime("createdAt");
        t.field("creator", {
            type: "User",
            resolve: (parent, args, context) => {
                return context.prisma.community
                    .findUnique({
                    where: { id: parent.id },
                })
                    .creator();
            },
        });
        t.nonNull.list.field("members", {
            type: "User",
            resolve: (parent, args, context) => {
                return context.prisma.community
                    .findUnique({
                    where: { id: parent.id },
                })
                    .members();
            },
        });
        t.list.field("posts", {
            type: "Post",
            resolve: (parent, args, context, info) => {
                return context.prisma.community
                    .findUnique({
                    where: { id: parent.id },
                })
                    .posts();
            },
        });
    },
});
exports.communitylist = (0, nexus_1.objectType)({
    isTypeOf: (data) => {
        const isTypeValid = "communities" in data ? true : false;
        return isTypeValid;
    },
    name: "CommunityList",
    definition: (t) => {
        t.list.field("communities", { type: "Community" });
    },
});
exports.CommunityListResponse = (0, nexus_1.unionType)({
    name: "CommunityListResponse",
    definition: (t) => {
        t.members("CommunityList", "CommonError");
    },
});
exports.CommunityResponse = (0, nexus_1.unionType)({
    name: "CommunityResponse",
    definition: (t) => {
        t.members("Community", "CommonError");
    },
});
//# sourceMappingURL=community.types.js.map