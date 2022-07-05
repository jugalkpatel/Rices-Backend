import { objectType, unionType } from "nexus";
import { Context } from "types";

export const Comment = objectType({
  name: "Comment",
  isTypeOf: (data) => {
    const isTypeValid = "text" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("text");
    t.nonNull.dateTime("createdAt");
    t.field("user", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.comment
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });
    t.field("post", {
      type: "Post",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.comment
          .findUnique({ where: { id: parent.id } })
          .post();
      },
    });
    t.list.field("votes", {
      type: "CommentVote",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.comment
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});

export const CommentVote = objectType({
  name: "CommentVote",
  isTypeOf: (data) => {
    const isTypeValid = "type" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.field("type", { type: "VoteType" });
    t.nonNull.dateTime("createdAt");
    t.field("comment", {
      type: "Comment",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.commentVote
          .findUnique({
            where: { id: parent.id },
          })
          .comment();
      },
    });
    t.field("votedBy", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.commentVote
          .findUnique({ where: { id: parent.id } })
          .votedBy();
      },
    });
  },
});

export const CommentReponse = unionType({
  name: "CommentResponse",
  definition: (t) => {
    t.members("Comment", "CommonError");
  },
});

export const CommentVoteResponse = unionType({
  name: "CommentVoteResponse",
  definition: (t) => {
    t.members("CommentVote", "CommonError");
  },
});
