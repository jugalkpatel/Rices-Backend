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

          const community = await prisma.community.create({
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

          console.log({ community });

          return { id: community.id, title: community.title };
        } catch (error) {
          console.log({ error });
          return {
            message: "unexpected error occurred while creating community",
          };
        }
      },
    });
  },
});

// make a mutation that will return all communties data.

// make a mutation that return specific community data.
// getCommunity

// export const getCommunityData = extendType({
//   type: "Mutation",
//   definition: (t) => {
//     t.nonNull.field("GetCommunityResponse", {
//       type: "GetCommunityResponse",
//       args: {
//         id: nonNull(stringArg()),
//       },
//       resolve: async (_parent, args, context: Context) => {
//         try {
//           const { prisma } = context;
//           const { id } = args;

//           const community = await prisma.community.findUnique({
//             where: { id },
//             include: {
//               creator: true,
//               members: true,
//             },
//           });

//           if (!community) {
//             return { message: "community not found!" };
//           }

//           return community;
//         } catch (error) {
//           return {
//             message: "unexpected error occurred while finding community",
//           };
//         }
//       },
//     });
//   },
// });
