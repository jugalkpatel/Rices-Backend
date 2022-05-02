import { extendType } from "nexus";
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
  },
});
