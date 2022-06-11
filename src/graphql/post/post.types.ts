import { interfaceType, objectType, unionType } from "nexus";

export const IPost = interfaceType({
  name: "IPost",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("content");
    t.nonNull.dateTime("createdAt");
  },
});

export const Post = objectType({
  name: "Post",
  isTypeOf: (data) => {
    const isTypeValid = "content" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("IPost");
    t.nonNull.field("postedBy", { type: "User" });
    t.nonNull.field("community", { type: "Community" });
    t.list.field("votes", { type: "Vote" });
    t.list.field("comments", { type: "Comment" });
  },
});

export const PostError = objectType({
  name: "PostError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
  },
});

export const IPostUser = objectType({
  name: "IPostUser",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("picture");
  },
});

export const IUserWithID = objectType({
  name: "IUserWithID",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

export const IPostCommunity = objectType({
  name: "IPostCommunity",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("picture");
    t.nonNull.string("banner");
    t.nonNull.string("description");
    t.list.nonNull.field("members", { type: "IUserWithID" });
    t.nonNull.dateTime("createdAt");
  },
});

export const ICommonVote = objectType({
  name: "ICommonVote",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.field("type", { type: "VoteType" });
    t.nonNull.field("votedBy", { type: "IUserWithID" });
  },
});

export const IPostComment = objectType({
  name: "IPostComment",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.string("text");
    t.nonNull.field("user", { type: "IPostUser" });
    t.list.nonNull.field("votes", { type: "ICommonVote" });
  },
});

export const IPostType = objectType({
  name: "IPostType",
  isTypeOf: (data) => {
    const isTypeValid = "postedBy" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("IPost");
    t.nonNull.field("postedBy", { type: "IPostUser" });
    t.nonNull.field("community", { type: "IPostCommunity" });
    t.list.nonNull.field("votes", { type: "ICommonVote" });
    t.list.field("comments", { type: "IPostComment" });
    t.list.field("bookmarkedBy", { type: "IUserWithID" });
  },
});

// Get Post
export const GetPostResponse = unionType({
  name: "GetPostResponse",
  definition: (t) => {
    t.members("IPostType", "PostError");
  },
});

// Create Post
export const CreatePostResult = objectType({
  name: "CreatePostResult",
  isTypeOf: (data) => {
    const isTypeValid = "id" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("community");
  },
});

export const CreatePostResponse = unionType({
  name: "CreatePostResponse",
  definition: (t) => {
    t.members("CreatePostResult", "PostError");
  },
});
