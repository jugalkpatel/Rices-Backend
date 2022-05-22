import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "types";

export const allCommunities = extendType({
  type: "Query",
  definition: (t) => {
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

    t.nonNull.field("GetCommunityResponse", {
      type: "GetCommunityResponse",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        try {
          const { prisma } = context;
          const { name } = args;

          const community = await prisma.community.findUnique({
            where: { title: name },
            include: { creator: true, members: true },
          });

          if (!community) {
            return { message: "community not found!" };
          }

          return community;
        } catch (error) {
          return {
            message: "unexpected error occurred while finding community",
          };
        }
      },
    });
  },
});