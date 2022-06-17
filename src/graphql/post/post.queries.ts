import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";

export const postQueries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchPost", {
      type: "FetchPostResponse",
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

          const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
              bookmarkedBy: { select: { id: true } },
              community: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  picture: true,
                  createdAt: true,
                  updatedAt: true,
                  banner: true,
                },
              },
              postedBy: { select: { id: true, name: true, picture: true } },
              votes: {
                select: {
                  id: true,
                  type: true,
                  votedBy: { select: { id: true } },
                },
              },
              comments: {
                include: {
                  post: { select: { id: true } },
                  user: { select: { id: true, name: true, picture: true } },
                  votes: {
                    select: {
                      id: true,
                      type: true,
                      votedBy: { select: { id: true } },
                    },
                  },
                },
              },
            },
          });

          if (!post) {
            throw new Error("unexpected error occurred while getting post");
          }

          return post;
        } catch (error) {
          console.log({ error });
          const errorMessage = error as Error;
          return { message: errorMessage?.message || "something went wrong!" };
        }
      },
    });
  },
});
