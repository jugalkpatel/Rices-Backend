import { extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";

import { Context } from "types";
import { setCookies, checkTokenVersion, clearTokens } from "../../utils";

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
      resolve: async (_root, args, context: Context) => {
        const { email, password } = args;
        const { prisma, response } = context;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.id) {
          return {
            message: "user not available",
          };
        }

        const { tokenVersion } = user;

        const userPassword = await prisma.password.findUnique({
          where: { userId: user.id },
        });

        const isPasswordValid = await bcrypt.compare(
          password,
          userPassword?.password ?? ""
        );

        if (!isPasswordValid) {
          return {
            message: "Invalid e-mail or password",
          };
        }

        setCookies(response, user.id, tokenVersion);

        return {
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
      resolve: async (_root, args, context: Context) => {
        const { email, name, password } = args;
        const { prisma, response } = context;

        const isUserAlreadyRegistered = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        });

        if (isUserAlreadyRegistered) {
          return {
            message: "User already registered!",
          };
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        console.log({ encryptedPassword });

        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: { create: { password: encryptedPassword } },
          },
        });

        if (!user?.id) {
          return {
            message: "error occurred while creating user!",
          };
        }
        const { tokenVersion } = user;

        setCookies(response, user.id, tokenVersion);

        return {
          user,
        };
      },
    });

    t.nonNull.field("authenticate", {
      type: "AuthResponse",
      resolve: async (_root, _args, ctx: Context) => {
        const { prisma, response, request, userId } = ctx;

        if (!userId) {
          return { message: "user not available" };
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

    t.nonNull.field("refresh", {
      type: "RefreshResponse",
      resolve: async (_root, _args, ctx: Context) => {
        const { prisma, response, userId, tokenVersion } = ctx;

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || userId !== user?.id) {
          clearTokens(response);
          return { message: "user not found!" };
        }

        if (
          !tokenVersion ||
          !user?.tokenVersion ||
          !checkTokenVersion(tokenVersion, user.tokenVersion)
        ) {
          clearTokens(response);
          return { message: "invalid token!" };
        }

        setCookies(response, user.id, user.tokenVersion);

        return { success: true };
      },
    });
  },
});

// logout mutation

// clear tokens
// increase tokenversion by 1

// logout all-route

// clear tokens
// incrase tokenversion by 1
