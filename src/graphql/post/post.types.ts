import { list, objectType } from "nexus";

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
    t.nonNull.field("postedBy", { type: "User" });
    // t.nonNull.field("community", { type: "Community" });
    // t.field("votes", { type: list("Vote") });
    // t.field("comments", { type: list("Comment") });
  },
});

export const CommunityPost = objectType({
  name: "CommunityPost",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("content");
    t.nonNull.dateTime("createdAt");
    t.nonNull.field("postedBy", { type: "User" });
  },
});
