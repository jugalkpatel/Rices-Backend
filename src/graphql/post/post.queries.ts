import { extendType, intArg, nonNull, stringArg } from "nexus";

import { Context } from "types";
import { filterPosts } from "../../utils";

export const postQueries = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("fetchPost", {
      type: "PostResponse",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma } = context;
          const { postId } = args;

          if (!postId) {
            return { message: "error occurred while parsing input." };
          }

          const post = await prisma.post.findUnique({
            where: { id: postId },
          });

          if (!post?.id) {
            return { message: "post not found" };
          }

          return post;
        } catch (error) {
          return { message: "unexpected error while fetching post" };
        }
      },
    });

    t.nonNull.field("fetchAllUserPosts", {
      type: "BatchPostsResponse",
      args: {
        skip: intArg(),
        take: nonNull(intArg()),
        cursorId: stringArg(),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma, userId } = context;
          const { take, cursorId } = args;
          let { skip } = args;
          let posts;

          if (!skip) {
            skip = 1;
          }

          if (!userId) {
            return { message: "user not available" };
          }

          console.log({ cursorId });

          if (cursorId) {
            console.log("returning cursor based");
            posts = await prisma.post.findMany({
              where: { community: { members: { some: { id: userId } } } },
              skip,
              take,
              cursor: { id: cursorId },
            });
          } else {
            posts = await prisma.post.findMany({
              where: { community: { members: { some: { id: userId } } } },
              skip,
              take,
            });
          }

          if (!posts.length) {
            return { message: "there are no communities that joined by user" };
          }

          const newCursorId = posts[posts.length - 1].id;

          return { posts, cursorId: newCursorId };
        } catch (error) {
          return {
            message: "unexpected error occurred while fetching all user posts",
          };
        }
      },
    });

    t.nonNull.field("fetchAllPostsByTime", {
      type: "BatchPostsResponse",
      args: {
        skip: intArg(),
        take: nonNull(intArg()),
        cursorId: stringArg(),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma } = context;
          const { take, cursorId } = args;
          let { skip } = args;
          let posts;

          if (!skip) {
            skip = 1;
          }

          const allPosts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
          });

          const lastPostId = allPosts[allPosts.length - 1].id;

          if (cursorId) {
            posts = await prisma.post.findMany({
              orderBy: {
                createdAt: "desc",
              },
              take,
              skip,
              cursor: { id: cursorId },
            });
          } else {
            posts = await prisma.post.findMany({
              orderBy: {
                createdAt: "desc",
              },
              skip,
              take,
            });
          }

          if (!posts.length) {
            return { message: "posts not found" };
          }

          const newCursorId = posts[posts.length - 1].id;

          if (newCursorId === lastPostId) {
            return { posts, cursorId: "" };
          }

          return { posts, cursorId: newCursorId };
        } catch (error) {
          return {
            message: "unexpected error occurred while fetching all posts",
          };
        }
      },
    });

    t.nonNull.field("fetchAllPostsByVotes", {
      type: "BatchPostsResponse",
      args: {
        take: nonNull(intArg()),
        cursorId: stringArg(),
      },
      resolve: async (parent, args, context: Context, info) => {
        try {
          const { prisma } = context;
          const { take, cursorId } = args;

          const allPosts = await prisma.post.findMany({
            orderBy: { title: "asc" },
            include: { votes: true },
          });

          const filteredPosts = filterPosts(allPosts);

          const lastPostId = filteredPosts[filteredPosts.length - 1].id;

          if (take > filteredPosts.length) {
            return { posts: filteredPosts, cursorId: "" };
          }

          if (!cursorId) {
            const posts = filteredPosts.slice(0, take);

            const newCursorId = posts[posts.length - 1].id;

            return { posts, cursorId: newCursorId };
          }

          const cursorIndex = filteredPosts.findIndex(
            ({ id }) => id === cursorId
          );

          if (cursorIndex + 1 + take > filteredPosts.length) {
            return {
              posts: filteredPosts.slice(cursorIndex + 1),
              cursorId: "",
            };
          }

          const posts = filteredPosts.slice(
            cursorIndex + 1,
            cursorIndex + take + 1
          );

          const newCursorId = posts[posts.length - 1].id;

          if (newCursorId === lastPostId) {
            return { posts, cursorId: "" };
          }

          return { posts, cursorId: newCursorId };
        } catch (error) {
          return { message: "unexpected error while fetching posts." };
        }
      },
    });
  },
});
