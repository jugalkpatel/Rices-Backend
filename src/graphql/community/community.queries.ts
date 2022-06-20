import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "types";

export const allCommunities = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchCommunity", {
      type: "CommunityResponse",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
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
        } catch (error) {
          return {
            message: "unexpected error occurred while finding community",
          };
        }
      },
    });

    t.nonNull.field("allCommunities", {
      type: "AllCommunitiesResponse",
      resolve: async (parent, args, context: Context, info) => {
        try {
          const communityList = await context.prisma.community.findMany({
            select: { id: true, title: true },
          });

          if (!communityList || !communityList.length) {
            return { message: "there are no communities created!" };
          }

          return {
            communities: communityList,
          };
        } catch (_) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
