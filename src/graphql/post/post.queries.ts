import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";

export const postQueries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchPost", {
      type: "PostResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma } = context;
          const { postId } = args;

          if (!postId) {
            return { message: "error occurred while parsing input." };
          }

          const post = await prisma.post.findUnique({
            where: { id: postId },
          });

          if (!post?.id) {
            return { message: "post not found" };
          }

          return post;
        } catch (error) {
          return { message: "unexpected error while fetching post" };
        }
      },
    });
  },
});
