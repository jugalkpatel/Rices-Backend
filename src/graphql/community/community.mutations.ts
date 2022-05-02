import { extendType, stringArg, nonNull } from "nexus";
import { Context } from "types";

export const CreateCommunity = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("CreateCommunity", {
      type: "CommunityResponse",
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context) => {
        try {
          const { userId } = context;
          const { name, description } = args;

          const isNameAlreadyUsed = await context.prisma.community.findUnique({
            where: { title: name },
          });

          if (isNameAlreadyUsed?.id) {
            return { message: "name is already used" };
          }

          const community = await context.prisma.community.create({
            data: {
              title: name,
              description,
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
        } catch (_) {
          return {
            message: "unexpected error occurred while creating community",
          };
        }
      },
    });
  },
});
