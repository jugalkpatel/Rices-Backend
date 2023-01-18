"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQueries = void 0;
const nexus_1 = require("nexus");
const utils_1 = require("../../utils");
exports.postQueries = (0, nexus_1.extendType)({
    type: "Query",
    definition: (t) => {
        t.nonNull.field("fetchPost", {
            type: "PostResponse",
            args: {
                postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
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
                }
                catch (error) {
                    console.log({ error });
                    return { message: "unexpected error while fetching post" };
                }
            },
        });
        t.nonNull.field("fetchAllUserPostsByTime", {
            type: "BatchPostsResponse",
            args: {
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                cursorId: (0, nexus_1.stringArg)(),
            },
            resolve: async (parent, args, context, info) => {
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
                    if (cursorId) {
                        posts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                            where: { community: { members: { some: { id: userId } } } },
                            skip,
                            take,
                            cursor: { id: cursorId },
                        });
                    }
                    else {
                        posts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                            where: {
                                community: { members: { some: { id: { equals: userId } } } },
                            },
                            take,
                        });
                    }
                    if (posts.length) {
                        const newCursorId = posts[posts.length - 1].id;
                        const allPosts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                        });
                        const lastPostId = allPosts[allPosts.length - 1].id;
                        if (newCursorId === lastPostId) {
                            return { posts, cursorId: "" };
                        }
                        return { posts, cursorId: newCursorId };
                    }
                    return { posts, cursorId: "" };
                }
                catch (error) {
                    console.log({ error });
                    return {
                        message: "unexpected error occurred while fetching all user posts",
                    };
                }
            },
        });
        t.nonNull.field("fetchAllUserPostsByVote", {
            type: "BatchPostsResponse",
            args: {
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                cursorId: (0, nexus_1.stringArg)(),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, userId } = context;
                    const { take, cursorId } = args;
                    const allPosts = await prisma.post.findMany({
                        orderBy: { createdAt: "desc" },
                        where: { community: { members: { some: { id: userId } } } },
                        include: { votes: true },
                    });
                    const { posts, cursorId: newCursorId } = (0, utils_1.filterPostsByVote)({
                        allPosts,
                        take,
                        cursorId: cursorId ? cursorId : null,
                    });
                    return { posts, cursorId: newCursorId };
                }
                catch (error) {
                    console.log({ error });
                    return {
                        message: "unexpected error occurred while fetching all user posts",
                    };
                }
            },
        });
        t.nonNull.field("fetchAllPostsByTime", {
            type: "BatchPostsResponse",
            args: {
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                cursorId: (0, nexus_1.stringArg)(),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma } = context;
                    const { take, cursorId } = args;
                    let { skip } = args;
                    let posts;
                    if (!skip) {
                        skip = 1;
                    }
                    if (cursorId) {
                        posts = await prisma.post.findMany({
                            orderBy: {
                                createdAt: "desc",
                            },
                            take,
                            skip,
                            cursor: { id: cursorId },
                        });
                    }
                    else {
                        posts = await prisma.post.findMany({
                            orderBy: {
                                createdAt: "desc",
                            },
                            take,
                        });
                    }
                    if (posts.length) {
                        const newCursorId = posts[posts.length - 1].id;
                        const allPosts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                        });
                        const lastPostId = allPosts[allPosts.length - 1].id;
                        if (newCursorId === lastPostId) {
                            return { posts, cursorId: "" };
                        }
                        return { posts, cursorId: newCursorId };
                    }
                    return { posts, cursorId: "" };
                }
                catch (error) {
                    return {
                        message: "unexpected error occurred while fetching all posts",
                    };
                }
            },
        });
        t.nonNull.field("fetchAllPostsByVotes", {
            type: "BatchPostsResponse",
            args: {
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                cursorId: (0, nexus_1.stringArg)(),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma } = context;
                    const { take, cursorId } = args;
                    const allPosts = await prisma.post.findMany({
                        orderBy: { title: "asc" },
                        include: { votes: true },
                    });
                    const { cursorId: newCursorId, posts } = (0, utils_1.filterPostsByVote)({
                        allPosts,
                        take,
                        cursorId: cursorId ? cursorId : null,
                    });
                    return { posts, cursorId: newCursorId };
                }
                catch (error) {
                    return { message: "unexpected error while fetching posts." };
                }
            },
        });
        t.nonNull.field("fetchUserBookmarks", {
            type: "BatchPostsResponse",
            args: {
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                cursorId: (0, nexus_1.stringArg)(),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, userId } = context;
                    const { take, cursorId } = args;
                    const skip = 1;
                    let posts;
                    if (cursorId) {
                        posts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                            where: { bookmarkedBy: { some: { id: userId } } },
                            take,
                            skip,
                            cursor: { id: cursorId },
                        });
                    }
                    else {
                        posts = await prisma.post.findMany({
                            orderBy: { createdAt: "desc" },
                            where: { bookmarkedBy: { some: { id: userId } } },
                            take,
                        });
                    }
                    if (!posts.length) {
                        return { posts, cursorId: "" };
                    }
                    const newCursorId = posts[posts.length - 1].id;
                    return { posts, cursorId: newCursorId };
                }
                catch (error) {
                    return {
                        message: "unexpected error occurred while fetching bookmarks",
                    };
                }
            },
        });
    },
});
//# sourceMappingURL=post.queries.js.map