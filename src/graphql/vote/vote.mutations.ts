import { extendType, nonNull, stringArg } from "nexus";

import { Context } from "types";
import { VoteArgs } from "./vote.types";

export const voteMutations = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("vote", {
      type: "VoteResponse",
      args: { data: VoteArgs },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { data } = args;

          if (!data) {
            return { message: "error while parsing inputs" };
          }

          const { communityId, type, postId } = data;
          const { prisma, userId } = context;

          const exisingVote = await prisma.vote.findFirst({
            where: {
              AND: [
                {
                  postId: { equals: postId },
                  post: { communityId: { equals: communityId } },
                },
                {
                  userId: { equals: userId },
                },
              ],
            },
          });

          if (exisingVote && exisingVote.id) {
            if (exisingVote.type === type) {
              return { message: "operation not allowed" };
            }

            const newType: typeof type =
              exisingVote.type === "UPVOTE" ? "DOWNVOTE" : "UPVOTE";

            const updateVote = await prisma.vote.update({
              where: { id: exisingVote.id },
              data: { type: newType },
            });

            return updateVote;
          }

          const newVote = await prisma.vote.create({
            data: {
              type,
              post: { connect: { id: postId } },
              voteUser: { connect: { id: userId } },
            },
          });

          if (!newVote || !newVote?.id) {
            return { message: "error while voting the post" };
          }

          return newVote;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error occurred while voting the post" };
        }
      },
    });

    t.nonNull.field("removeVote", {
      type: "VoteResponse",
      args: {
        postId: nonNull(stringArg()),
        voteId: nonNull(stringArg()),
        communityId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { postId, voteId } = args;

          const vote = await prisma.vote.findFirst({
            where: {
              AND: [{ id: voteId }, { postId: postId }, { userId: userId }],
            },
          });

          if (!vote || !vote.id) {
            return { message: "vote does not exist." };
          }

          const deleteVote = await prisma.vote.delete({
            where: { id: voteId },
          });

          if (!deleteVote || !deleteVote?.id) {
            return { message: "error while deleting post" };
          }

          return deleteVote;
        } catch (error) {
          console.log({ error });
          return { message: "unexpected error while removing vote" };
        }
      },
    });
  },
});
