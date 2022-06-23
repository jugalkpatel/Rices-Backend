import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";

export const CommentMutations = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createComment", {
      type: "CommentResponse",
      args: {
        postId: nonNull(stringArg()),
        text: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { postId, text } = args;
          const { prisma, userId } = context;

          if (!postId || !userId || !text) {
            return {
              message: "error while parsing inputs",
            };
          }

          const comment = await prisma.comment.create({
            data: {
              text,
              post: { connect: { id: postId } },
              user: { connect: { id: userId } },
              votes: { create: { votedBy: { connect: { id: userId } } } },
            },
          });

          if (!comment?.id) {
            throw new Error();
          }

          return comment;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error while creating community!" };
        }
      },
    });
  },
  // protected mutation
  //   t.nonNull.field("createComment", {
  //     type: "CreateCommentResponse",
  //     args: {
  //       postId: nonNull(stringArg()),
  //       text: nonNull(stringArg()),
  //     },
  //     resolve: async (parent, args, context: Context, info) => {
  //       try {
  //         const { postId, text } = args;
  //         const { prisma, userId } = context;

  //         if (!postId || !userId || !text) {
  //           return {
  //             message: "error while parsing inputs",
  //           };
  //         }

  //         const comment = await prisma.comment.create({
  //           data: {
  //             text,
  //             post: { connect: { id: postId } },
  //             user: { connect: { id: userId } },
  //             votes: { create: { votedBy: { connect: { id: userId } } } },
  //           },
  //           include: {
  //             user: { select: { id: true, picture: true, name: true } },
  //             post: { select: { id: true } },
  //             votes: {
  //               select: {
  //                 id: true,
  //                 type: true,
  //                 votedBy: { select: { id: true } },
  //               },
  //             },
  //           },
  //         });

  //         if (!comment || !comment.id) {
  //           return { message: "error occurred while creating comment." };
  //         }

  //         return comment;
  //       } catch (error) {
  //         return { message: "something went wrong" };
  //       }
  //     },
  //   });
  // },
});
