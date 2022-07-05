import { objectType, unionType } from "nexus";

import { Context } from "types";

export const User = objectType({
  isTypeOf: (data) => {
    const isTypeValid = "email" in data ? true : false;

    return isTypeValid;
  },
  name: "User",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("picture");
    t.nonNull.int("tokenVersion");
    t.nonNull.dateTime("createdAt");
    t.field("password", {
      type: "Password",
      resolve: (parent, args, context: Context) => {
        return context.prisma.user
          .findUnique({
            where: { id: parent.id },
          })
          .password();
      },
    });
    t.list.nonNull.field("communitiesCreated", {
      type: "Community",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .communitiesCreated();
      },
    });
    t.list.nonNull.field("joinedCommunities", {
      type: "Community",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .joinedCommunities();
      },
    });
    t.list.field("posts", {
      type: "Post",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .posts();
      },
    });
    t.list.field("bookmarks", {
      type: "Post",
      resolve: (parent, args, context: Context, infor) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .bookmarks();
      },
    });
    t.list.field("commentedOn", {
      type: "Comment",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .commentedOn();
      },
    });
    t.list.field("votes", {
      type: "Vote",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
    t.nonNull.list.field("commentVotes", {
      type: "CommentVote",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .commentVotes();
      },
    });
  },
});

export const UserResponse = unionType({
  name: "UserResponse",
  definition: (t) => {
    t.members("User", "CommonError");
  },
});
