"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityQueries = void 0;
const nexus_1 = require("nexus");
exports.communityQueries = (0, nexus_1.extendType)({
    type: "Query",
    definition: (t) => {
        t.nonNull.field("fetchCommunity", {
            type: "CommunityResponse",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma } = context;
                    const { name } = args;
                    console.log("client called");
                    const community = await prisma.community.findUnique({
                        where: { title: name },
                    });
                    if (!community?.id) {
                        return { message: "community not found" };
                    }
                    return community;
                }
                catch (error) {
                    return {
                        message: "unexpected error occurred while finding community",
                    };
                }
            },
        });
        t.nonNull.field("fetchAllCommunities", {
            type: "CommunityListResponse",
            resolve: async (parent, args, context, info) => {
                try {
                    const communityList = await context.prisma.community.findMany({});
                    if (!communityList || !communityList?.length) {
                        return { message: "there are not communities created" };
                    }
                    return { communities: communityList };
                }
                catch (error) {
                    return { message: "unexpected error while fetching all communities" };
                }
            },
        });
    },
});
//# sourceMappingURL=community.queries.js.map