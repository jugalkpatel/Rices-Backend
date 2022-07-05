import { enumType, interfaceType, objectType, unionType } from "nexus";
import { Context } from "types";

export const Post = objectType({
  name: "Post",
  isTypeOf: (data) => {
    const isTypeValid = "content" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("content");
    t.nonNull.dateTime("createdAt");
    t.field("community", {
      type: "Community",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .community();
      },
    });
    t.field("postedBy", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.list.field("bookmarkedBy", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .bookmarkedBy();
      },
    });
    t.list.field("comments", {
      type: "Comment",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .comments();
      },
    });
    t.nonNull.list.field("votes", {
      type: "Vote",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});

export const PostResponse = unionType({
  name: "PostResponse",
  definition: (t) => {
    t.members("Post", "CommonError");
  },
});

export const BatchPosts = objectType({
  name: "BatchPosts",
  isTypeOf: (data) => {
    const isTypeValid = "cursorId" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("cursorId");
    t.list.field("posts", {
      type: "Post",
    });
  },
});

export const FilterType = enumType({
  name: "FilterType",
  members: ["TOP", "NEW"],
});

export const BatchPostsResponse = unionType({
  name: "BatchPostsResponse",
  definition: (t) => {
    t.members("BatchPosts", "CommonError");
  },
});
