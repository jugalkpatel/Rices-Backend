import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";
import { setCookies } from "../../utils";

export const queries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("authenticate", {
      type: "AuthResponse",
      resolve: async (_root, _args, ctx: Context) => {
        const { prisma, response, userId } = ctx;

        if (!userId) {
          return { message: "user not avaialable" };
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || userId !== user?.id) {
          return { message: "user not found!" };
        }

        setCookies(response, user.id, user.tokenVersion);

        return {
          user,
        };
      },
    });
  },
});
