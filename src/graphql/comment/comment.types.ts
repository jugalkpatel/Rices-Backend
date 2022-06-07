import { objectType } from "nexus";

export const Comment = objectType({
  name: "Comment",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("text");
    t.field("user", { type: "User" });
    t.field("post", { type: "Post" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});
