import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "types";

export const getPost = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("getPost", {
      type: "GetPostResponse",
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
              community: {
                select: {
                  id: true,
                  title: true,
                  banner: true,
                  picture: true,
                  createdAt: true,
                  description: true,
                  members: {
                    select: { id: true },
                  },
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
                  user: { select: { id: true, name: true, picture: true } },
                  votes: { select: { id: true, type: true, votedBy: true } },
                },
              },
              bookmarkedBy: { select: { id: true } },
            },
          });

          if (!post) {
            throw new Error("unexpected error occurred while getting post");
          }

          return post;
        } catch (error) {
          const errorMessage = error as Error;
          return { message: errorMessage?.message || "something went wrong!" };
        }
      },
    });
  },
});

// select: {
//   id: true,
//   createdAt: true,
//   text: true,
//   user: { select: { id: true, name: true, picture: true } },
// },
