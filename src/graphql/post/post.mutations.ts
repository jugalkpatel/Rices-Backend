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

    // t.nonNull.field("removeVote", {
    //   type: "PostResponse",
    //   args: {
    //     postId: nonNull(stringArg()),
    //     voteId: nonNull(stringArg()),
    //   },
    //   resolve: async (parent, args, context: Context, info) => {
    //     try {
    //       const { prisma, userId } = context;
    //       const { postId, voteId } = args;

    //       if (!postId || !voteId) {
    //         return { message: "error while parsing inputs" };
    //       }

    //       const vote = await prisma.vote.findFirst({
    //         where: {
    //           AND: [{ id: voteId }, { postId: postId }],
    //         },
    //       });

    //       if (!vote || !vote.id) {
    //         return { message: "invalid operation" };
    //       }

    //       const deattchUser = await prisma.user.update({
    //         where: { id: userId },
    //         data: { votes: { disconnect: [{ id: voteId }] } },
    //       });

    //       const deattchPost = await prisma.post.update({
    //         where: { id: postId },
    //         data: { votes: { disconnect: [{ id: voteId }] } },
    //       });

    //       const deleteVote = await prisma.vote.delete({
    //         where: { id: voteId },
    //       });

    //       // const transaction = await prisma.$transaction([
    //       //   deattchUser,
    //       //   deattchPost,
    //       //   deleteVote,
    //       // ]);

    //       return post;
    //     } catch (error) {
    //       return { message: "unexpected error while removing vote" };
    //     }
    //   },
    // });
  },
});
