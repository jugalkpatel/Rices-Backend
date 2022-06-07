import { objectType, list, unionType, enumType, arg, nonNull } from "nexus";

export const VoteType = enumType({
  name: "VoteType",
  members: ["UPVOTE", "DOWNVOTE"],
});

export const Vote = objectType({
  name: "Vote",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.int("count");
    t.nonNull.field("type", { type: VoteType });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.field("votedBy", { type: "User" });
    t.nonNull.field("post", { type: "Post" });
  },
});
