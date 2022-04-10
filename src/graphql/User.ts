import { extendType, nonNull, objectType, stringArg } from "nexus";

export const User = objectType({
  name: "User",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("user", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
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
