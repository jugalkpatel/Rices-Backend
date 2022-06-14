import { extendType, stringArg, nonNull } from "nexus";

import { Context } from "types";
import { getBannerImg, getCommunityImg } from "../../utils";

export const CreateCommunity = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("CreateCommunity", {
      type: "CommunityResponse",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        try {
          const { userId, prisma } = context;
          const { name, description } = args;

          const isNameAlreadyUsed = await prisma.community.findUnique({
            where: { title: name },
          });

          if (isNameAlreadyUsed?.id) {
            return { message: "name is already used" };
          }

          const communityImg = getCommunityImg();

          const banner = getBannerImg();

          const community = await prisma.community.create({
            data: {
              title: name,
              description,
              banner,
              picture: communityImg,
              creator: { connect: { id: userId } },
              members: { connect: [{ id: userId }] },
            },
            select: {
              id: true,
              title: true,
            },
          });

          if (!community?.id || !community?.title) {
            return { message: "error occurred while creating community" };
          }

          return { id: community.id, title: community.title };
        } catch (error) {
          return {
            message: "unexpected error occurred while creating community",
          };
        }
      },
    });

    t.nonNull.field("JoinCommunity", {
      type: "JoinCommunityResponse",
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

          await prisma.community.update({
            where: {
              id: communityId,
            },
            data: {
              members: {
                connect: [{ id: userId }],
              },
            },
            select: { members: { select: { id: true } } },
          });

          return { id: userId };
        } catch (error) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });

    t.nonNull.field("leaveCommunity", {
      type: "JoinCommunityResponse",
      args: {
        communityId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context: Context) => {
        try {
          const { userId, prisma } = context;
          const { communityId } = args;

          console.log({ userId, communityId });

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

          if (!isUserAlreadyInCommunity) {
            return { message: "User is not a part of the community." };
          }

          await prisma.community.update({
            where: { id: communityId },
            data: {
              members: { disconnect: [{ id: userId }] },
            },
            select: { members: { select: { id: true } } },
          });

          return { id: userId };
        } catch (error) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });
  },
});
