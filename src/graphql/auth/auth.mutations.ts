import { extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const APP_SECRET = process.env.TOKEN_SECRET as string;
export const AuthMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    // login
    t.nonNull.field("login", {
      type: "AuthResponse",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        const { email, password } = args;
        const user = await context.prisma.user.findUnique({ where: { email } });

        if (!user?.id) {
          return {
            message: "user not available",
          };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return {
            message: "Invalid e-mail or password",
          };
        }

        const token = jwt.sign({ userId: user.id }, APP_SECRET, {
          expiresIn: "1h",
        });

        return {
          token,
          user,
        };
      },
    });

    // register
    t.nonNull.field("register", {
      type: "AuthResponse",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_root, args, context) => {
        const { email, name, password } = args;

        const isUserAlreadyRegistered = await context.prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (isUserAlreadyRegistered) {
          return {
            message: "User already registered!",
          };
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await context.prisma.user.create({
          data: { name, email, password: encryptedPassword },
        });

        if (!user?.id) {
          return {
            message: "error occurred while creating user!",
          };
        }

        const token = jwt.sign({ userId: user.id }, APP_SECRET, {
          expiresIn: "1h",
        });

        return {
          token,
          user,
        };
      },
    });
  },
});
