import { objectType } from "nexus";

export const Comment = objectType({
  name: "Comment",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("text");
    t.nonNull.field("user", { type: "User" });
    t.nonNull.field("post", { type: "Post" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});
