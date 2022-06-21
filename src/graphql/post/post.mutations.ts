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
                create: { votedBy: { connect: { id: userId } } },
              },
            },
          });

          if (!post || !post?.id) {
            return { message: "error occurred while creating post" };
          }

          return post;
        } catch (error) {
          return { message: "unexpected error occurred while creating post" };
        }
      },
    });
  },
});
