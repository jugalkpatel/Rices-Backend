import { extendType, objectType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const APP_SECRET = process.env.TOKEN_SECRET as string;

export const Auth = objectType({
  name: "AuthPayload",
  definition: (t) => {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        const { email, name, password } = args;

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await context.prisma.user.create({
          data: { email, name, password: encryptedPassword },
        });

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        const { email, password } = args;
        const user = await context.prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("no such user found!");
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new Error("Invalid Password!");
        }

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
        };
      },
    });
  },
});
