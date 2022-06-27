import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";
import { VoteType } from "../vote/vote.types";

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

    t.nonNull.field("voteComment", {
      type: "CommentVoteResponse",
      args: {
        type: nonNull(VoteType.name),
        commentId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { type, commentId } = args;

          const exisingVote = await prisma.commentVote.findFirst({
            where: {
              AND: [
                { commentId: { equals: commentId } },
                { userId: { equals: userId } },
              ],
            },
          });

          if (exisingVote && exisingVote.id) {
            if (exisingVote.type === type) {
              return { message: "operation is not allowed" };
            }

            const newType: typeof type =
              exisingVote.type === "UPVOTE" ? "DOWNVOTE" : "UPVOTE";

            const updatedVote = await prisma.commentVote.update({
              where: { id: exisingVote.id },
              data: { type: newType },
            });

            return updatedVote;
          }

          const newVote = await prisma.commentVote.create({
            data: {
              type,
              comment: { connect: { id: commentId } },
              votedBy: { connect: { id: userId } },
            },
          });

          if (!newVote || !newVote?.id) {
            return { message: "error while voting the post" };
          }

          return newVote;
        } catch (error) {
          return { message: "unexpected error occurred while voting comment" };
        }
      },
    });

    t.nonNull.field("removeCommentVote", {
      type: "CommentVoteResponse",
      args: {
        commentId: nonNull(stringArg()),
        voteId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { commentId, voteId } = args;

          console.log({ voteId, commentId, userId });

          const vote = await prisma.commentVote.findFirst({
            where: {
              AND: [
                { id: voteId },
                { commentId: commentId },
                { userId: userId },
              ],
            },
          });

          if (!vote || !vote.id) {
            return { message: "vote does not exist" };
          }

          const deletedVote = await prisma.commentVote.delete({
            where: { id: voteId },
          });

          if (!deletedVote || !deletedVote?.id) {
            return { message: "error while deleting comment" };
          }

          return deletedVote;
        } catch (error) {
          return {
            message: "unexpected error occurred while removing comment vote",
          };
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
