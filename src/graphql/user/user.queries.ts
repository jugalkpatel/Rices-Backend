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

          console.log({ userId });

          if (!userId) {
            return { message: "user not available!" };
          }

          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          const posts = await prisma.post.findMany({
            where: { community: { members: { every: { id: userId } } } },
          });

          console.log({ user });

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

    // t.nonNull.field("bookmarks", {
    //   type: "UserResponse",
    //   resolve: (parent, args, context: Context, info) => {
    //     bb;
    //   },
    // });
  },
});
