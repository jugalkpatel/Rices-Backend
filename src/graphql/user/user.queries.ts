import { extendType } from "nexus";
import { Context } from "types";

export const UserQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchUser", {
      type: "UserResponse",
      resolve: async (_root, args, context: Context) => {
        try {
          const { userId, prisma } = context;

          if (!userId) {
            return { message: "user not available!" };
          }

          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          const posts = await prisma.post.findMany({
            where: { community: { members: { every: { id: userId } } } },
          });

          if (!user || !user?.id) {
            return { message: "something went wrong!" };
          }

          return user;
        } catch (error) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
