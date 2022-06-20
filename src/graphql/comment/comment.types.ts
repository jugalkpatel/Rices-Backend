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
  // isTypeOf: (data) => {
  //   const isTypeValid = "comment" in data ? true : false;

  //   return isTypeValid;
  // },
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

//old
export const PostWithId = objectType({
  name: "PostWithId",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

// if change: update useFetch and useFetchComments in frontend
export const IComment = objectType({
  name: "IComment",
  isTypeOf: (data) => {
    const isTypeValid = "text" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("text");
    t.nonNull.field("user", { type: "IPostUser" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.field("post", { type: "PostWithId" });
    t.list.field("votes", { type: "ICommonVote" });
  },
});

// Create Comment
export const CreateCommentResponse = unionType({
  name: "CreateCommentResponse",
  definition: (t) => {
    t.members("IComment", "CommonError");
  },
});

// list Comments
export const FetchPostCommentsResult = objectType({
  name: "FetchPostCommentsResult",
  isTypeOf: (data) => {
    const isTypeValid = "comments" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("postId");
    t.list.field("comments", { type: "IComment" });
  },
});

export const FetchPostComments = unionType({
  name: "FetchPostCommentsResponse",
  definition: (t) => {
    t.members("FetchPostCommentsResult", "CommonError");
  },
});
