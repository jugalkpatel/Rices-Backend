import {
  extendType,
  objectType,
  nonNull,
  stringArg,
  unionType,
  interfaceType,
} from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const APP_SECRET = process.env.TOKEN_SECRET as string;

export const CommonError = interfaceType({
  name: "CommonError",
  definition(t) {
    t.nonNull.string("message");
  },
});

export const AuthError = objectType({
  name: "AuthError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  isTypeOf: (data) => {
    const isTypeValid = "token" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("token");
    t.nonNull.field("user", { type: "User" });
  },
});

export const AuthResponse = unionType({
  name: "AuthResponse",
  definition: (t) => {
    t.members("AuthPayload", "AuthError");
  },
});

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

        console.log({ email, password });

        const user = await context.prisma.user.findUnique({ where: { email } });

        if (!user?.id) {
          return {
            message: "User not found!",
          };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return {
            message: "Invalid e-mail or password",
          };
        }

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

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

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
        };
      },
    });
  },
});
