import { extendType, stringArg, nonNull } from "nexus";
import { Context } from "types";

export const UserQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("user", {
      type: "User",
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
        });

        if (!user || userId !== user?.id) {
          throw new Error("user not found!");
        }

        return user;
      },
    });
  },
});
