import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";

export const CreatePost = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createPost", {
      type: "PostResponse",
      args: {
        title: nonNull(stringArg()),
        content: nonNull(stringArg()),
        community: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { title, content, community } = args;

          const post = await prisma.post.create({
            data: {
              title,
              content,
              community: { connect: { id: community } },
              postedBy: { connect: { id: userId } },
              votes: {
                create: { voteUser: { connect: { id: userId } } },
              },
            },
          });

          if (!post || !post?.id) {
            return { message: "error occurred while creating post" };
          }

          return post;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error occurred while creating post" };
        }
      },
    });

    t.nonNull.field("createBookmark", {
      type: "PostResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { postId } = args;

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

          const bookmarkedPost = await prisma.post.update({
            where: {
              id: postId,
            },
            data: { bookmarkedBy: { connect: [{ id: userId }] } },
          });

          if (!bookmarkedPost?.id) {
            return { message: "error while adding post to the bookmarks" };
          }

          return bookmarkedPost;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error while creating bookmark" };
        }
      },
    });

    t.nonNull.field("removeBookmark", {
      type: "PostResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { postId } = args;

          const alreadyBookmarked = await prisma.user.findFirst({
            where: {
              AND: [
                { id: userId },
                { bookmarks: { some: { id: { contains: postId } } } },
              ],
            },
          });

          if (!alreadyBookmarked?.id) {
            return { message: "post is not bookmarked" };
          }

          const removedPost = await prisma.post.update({
            where: { id: postId },
            data: { bookmarkedBy: { disconnect: [{ id: userId }] } },
          });

          if (!removedPost?.id) {
            return { message: "error while removing post from the bookmarks" };
          }

          return removedPost;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error while creating bookmark" };
        }
      },
    });
  },
});
