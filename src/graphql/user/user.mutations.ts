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

    t.nonNull.field("createBookmark", {
      type: "UserResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { userId, prisma } = context;
          const { postId } = args;

          if (!postId || !userId) {
            return { message: "error while parsing inputs" };
          }

          const alreadyBookmarked = await prisma.user.findFirst({
            where: {
              AND: [
                { id: userId },
                { bookmarks: { some: { id: { contains: postId } } } },
              ],
            },
          });

          if (alreadyBookmarked?.id) {
            return { message: "post already bookmarked" };
          }

          const updatedUserWithBookmarks = await prisma.user.update({
            where: { id: userId },
            data: { bookmarks: { connect: [{ id: postId }] } },
          });

          if (!updatedUserWithBookmarks?.id) {
            return { message: "error while adding post to the bookmarks" };
          }

          return updatedUserWithBookmarks;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error while creating bookmark" };
        }
      },
    });

    t.nonNull.field("removeBookmark", {
      type: "UserResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { postId } = args;
          const { prisma, userId } = context;

          if (!postId || !userId) {
            return { message: "error while parsing inputs." };
          }

          const checkBookmark = await prisma.user.findFirst({
            where: { bookmarks: { some: { id: { contains: postId } } } },
          });

          if (!checkBookmark?.id) {
            return { message: "post is not in the bookmarks" };
          }

          const updatedUserWithBookmarks = await prisma.user.update({
            where: { id: userId },
            data: { bookmarks: { disconnect: [{ id: postId }] } },
          });

          if (!updatedUserWithBookmarks?.id) {
            return { message: "error while removing post from bookmarks" };
          }

          return updatedUserWithBookmarks;
        } catch (error) {
          console.log({ error });
          return {
            message: "unexpected error while removing post from bookmarks",
          };
        }
      },
    });
  },
});
