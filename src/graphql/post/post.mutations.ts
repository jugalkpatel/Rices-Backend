import { extendType, nonNull, stringArg } from "nexus";
import { Context } from "types";

export const CreatePost = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("createPost", {
      type: "CreatePostResponse",
      args: {
        title: nonNull(stringArg()),
        content: nonNull(stringArg()),
        community: nonNull(stringArg()),
      },
      resolve: async (_root, args, context: Context) => {
        try {
          const { prisma, userId } = context;
          const { title: postTitle, content, community: communityId } = args;

          if (!userId) {
            return { message: "error while parsing user" };
          }

          // create post
          // also create one vote for the same user with type 'UPVOTE'
          const post = await prisma.post.create({
            data: {
              title: postTitle,
              content,
              community: { connect: { id: communityId } },
              postedBy: { connect: { id: userId } },
              votes: {
                create: {
                  type: "UPVOTE",
                  votedBy: { connect: { id: userId } },
                },
              },
            },
            include: { community: { select: { title: true } } },
            // include: {
            //   community: { select: { id: true, title: true, picture: true } },
            //   postedBy: { select: { id: true, name: true, picture: true } },
            //   votes: {
            //     select: {
            //       id: true,
            //       type: true,
            //       votedBy: { select: { id: true } },
            //     },
            //   },
            //   comments: {
            //     select: {
            //       id: true,
            //       createdAt: true,
            //       text: true,
            //       user: { select: { id: true, name: true, picture: true } },
            //     },
            //   },
            // },
          });

          if (!post) {
            throw new Error("unexpected error occured while creating post");
          }

          const {
            community: { title: communityTitle },
            id,
            title,
          } = post;

          return { id, title, community: communityTitle };
        } catch (error) {
          console.log({ error });
          return { message: "something went wrong!" };
        }
      },
    });
  },
});
