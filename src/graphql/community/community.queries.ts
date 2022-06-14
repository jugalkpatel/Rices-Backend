import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "types";

export const allCommunities = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("allCommunities", {
      type: "AllCommunitiesResponse",
      resolve: async (parent, args, context: Context, info) => {
        try {
          const communityList = await context.prisma.community.findMany({
            select: { id: true, title: true },
          });

          if (!communityList || !communityList.length) {
            return { message: "there are no communities created!" };
          }

          return {
            communities: communityList,
          };
        } catch (_) {
          return {
            message: "something went wrong!",
          };
        }
      },
    });

    t.nonNull.field("fetchCommunity", {
      type: "FetchCommunityResponse",
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context) => {
        try {
          const { prisma } = context;
          const { name } = args;

          const community = await prisma.community.findUnique({
            where: { title: name },
            include: {
              creator: { select: { id: true } },
              members: { select: { id: true } },
              posts: {
                include: {
                  community: {
                    select: {
                      id: true,
                      title: true,
                      banner: true,
                      picture: true,
                      createdAt: true,
                      description: true,
                      updatedAt: true,
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
                      votes: {
                        select: { id: true, type: true, votedBy: true },
                      },
                    },
                  },
                  bookmarkedBy: { select: { id: true } },
                },
              },
            },
          });

          if (!community) {
            return { message: "community not found!" };
          }

          return community;
        } catch (error) {
          return {
            message: "unexpected error occurred while finding community",
          };
        }
      },
    });

    // t.nonNull.field("fetchCommunityWithPosts", {
    //   type: "FetchCommunityWithPostsResponse",
    //   args: {
    //     name: nonNull(stringArg()),
    //   },
    //   resolve: async (parent, args, context: Context) => {
    //     try {
    //       const { prisma } = context;
    //       const { name } = args;

    //       const community = await prisma.community.findUnique({
    //         where: { title: name },
    //         include: {
    //           posts: {
    //             include: {
    //               community: { select: { id: true } },
    //               postedBy: { select: { id: true, name: true, picture: true } },
    //               votes: {
    //                 select: {
    //                   id: true,
    //                   type: true,
    //                   votedBy: { select: { id: true } },
    //                 },
    //               },
    //               comments: {
    //                 include: {
    //                   user: { select: { id: true, name: true, picture: true } },
    //                   votes: {
    //                     select: { id: true, type: true, votedBy: true },
    //                   },
    //                 },
    //               },
    //               bookmarkedBy: { select: { id: true } },
    //             },
    //           },
    //         },
    //       });

    //       if (!community || !community.id) {
    //         throw new Error();
    //       }

    //       const { id, posts } = community;

    //       return {
    //         id,
    //         posts,
    //       };
    //     } catch (error) {
    //       return { message: "error occurred while fetching community" };
    //     }
    //   },
    // });
  },
});
