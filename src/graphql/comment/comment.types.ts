import { objectType, unionType } from "nexus";

export const CommentError = objectType({
  name: "CommentError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
  },
});

export const PostWithId = objectType({
  name: "PostWithId",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

// if change: update useFetch and useFetchComments in frontend
export const Comment = objectType({
  name: "Comment",
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
    t.members("Comment", "CommentError");
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
    t.list.field("comments", { type: "Comment" });
  },
});

export const FetchPostComments = unionType({
  name: "FetchPostCommentsResponse",
  definition: (t) => {
    t.members("FetchPostCommentsResult", "CommentError");
  },
});
