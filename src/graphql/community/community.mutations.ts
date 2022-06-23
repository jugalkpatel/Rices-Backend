import { extendType, stringArg, nonNull } from "nexus";

import { Context } from "types";
import { getBannerImg, getCommunityImg } from "../../utils";

export const CreateCommunity = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createCommunity", {
      type: "CommunityResponse",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { name, description } = args;
          const { prisma, userId } = context;

          const isNameAlreadyUsed = await prisma.community.findUnique({
            where: { title: name },
          });

          if (isNameAlreadyUsed) {
            return { message: "community name not available." };
          }

          const picture = getCommunityImg();

          const banner = getBannerImg();

          const community = await prisma.community.create({
            data: {
              title: name,
              description,
              banner,
              picture,
              creator: { connect: { id: userId } },
              members: { connect: [{ id: userId }] },
            },
          });

          if (!community?.id) {
            return { message: "error occurred while creating community" };
          }

          return community;
        } catch (error) {
          console.log({ error });
          return {
            message: "unexpected error occurred while creating community",
          };
        }
      },
    });

    t.nonNull.field("joinCommunity", {
      type: "CommunityResponse",
      args: {
        communityId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context) => {
        try {
          const { userId, prisma } = context;
          const { communityId } = args;

          if (!userId || !communityId) {
            return { message: "error while parsing input values" };
          }

          const community = await prisma.community.findUnique({
            where: { id: communityId },
            include: {
              members: { select: { id: true } },
            },
          });

          const isUserAlreadyInCommunity = community?.members.find(
            ({ id }) => id === userId
          );

          if (isUserAlreadyInCommunity) {
            return { message: "user is already in the community" };
          }

          const updatedCommunity = await prisma.community.update({
            where: { id: communityId },
            data: { members: { connect: [{ id: userId }] } },
          });

          return updatedCommunity;
        } catch (error) {
          console.log({ error });
          return {
            message: "unexpected error occurred while joining community.",
          };
        }
      },
    });

    t.nonNull.field("leaveCommunity", {
      type: "CommunityResponse",
      args: {
        communityId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        try {
          const { userId, prisma } = context;
          const { communityId } = args;

          if (!userId || !communityId) {
            return { message: "error while parsing input values" };
          }

          const community = await prisma.community.findFirst({
            where: {
              AND: [
                {
                  id: communityId,
                },
                {
                  members: { some: { id: { contains: userId } } },
                },
              ],
            },
          });

          console.log({ community });

          if (!community?.id) {
            return { message: "User is not a part of the community." };
          }

          const updatedCommunity = await prisma.community.update({
            where: { id: communityId },
            data: { members: { disconnect: [{ id: userId }] } },
          });

          return updatedCommunity;
        } catch (error) {
          console.log({ error });
          return {
            message: "unexpected error occurred while leaving community",
          };
        }
      },
    });
  },
});
