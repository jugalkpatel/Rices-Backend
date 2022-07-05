import { extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";

import { Context } from "types";
import { getProfileImg, setCookies } from "../../utils";

export const userMutations = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createUser", {
      type: "UserResponse",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { email, password, name } = args;
          const { prisma, response } = context;

          const isUserAlreadyRegistered = await prisma.user.findUnique({
            where: { email },
          });

          if (isUserAlreadyRegistered) {
            return { message: "user is unavailable" };
          }

          const encryptedPassword = await bcrypt.hash(password, 10);

          const picture = getProfileImg();

          const user = await prisma.user.create({
            data: {
              name,
              email,
              password: { create: { password: encryptedPassword } },
              picture,
            },
          });

          if (!user?.id) {
            return {
              message: "error occurred while creating user!",
            };
          }

          const { tokenVersion } = user;

          setCookies(response, user.id, tokenVersion);

          return user;
        } catch (error) {
          console.log({ error });
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
