import { extendType, stringArg, nonNull } from "nexus";
import { Context } from "types";

export const UserQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("user", {
      type: "IUserQueryResult",
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_root, args, context: Context) => {
        const { email } = args;
        const { userId } = context;
        if (!userId) {
          throw new Error("token not found!");
        }
        const user = await context.prisma.user.findUnique({
          where: { email },
          include: { joinedCommunities: { select: { id: true } } },
        });
        if (!user || userId !== user?.id) {
          throw new Error("user not found!");
        }
        return user;
      },
    });

    t.nonNull.field("getUserCommunities", {
      type: "GetUserCommunitiesResponse",
      resolve: async (_root, args, context: Context) => {
        try {
          const { userId, prisma } = context;

          if (!userId) {
            return { message: "user not available!" };
          }

          const communityList = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              joinedCommunities: {
                select: { id: true, title: true, picture: true },
              },
            },
          });

          if (!communityList) {
            return { message: "something went wrong!" };
          }

          const { id, joinedCommunities } = communityList;

          return { id, communities: joinedCommunities };
        } catch (error) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
