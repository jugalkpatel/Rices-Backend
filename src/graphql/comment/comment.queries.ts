import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";

// not used anywhere
export const commentQueries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchPostComments", {
      type: "FetchPostCommentsResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma } = context;
          const { postId } = args;

          if (!postId) {
            return { message: "error occurred while parsing input" };
          }

          const comments = await prisma.comment.findMany({
            where: { post: { id: postId } },
            include: {
              user: { select: { id: true, name: true, picture: true } },
              votes: {
                select: {
                  id: true,
                  type: true,
                  votedBy: { select: { id: true } },
                },
              },
              post: { select: { id: true } },
            },
          });

          return { postId, comments };
        } catch (error) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
