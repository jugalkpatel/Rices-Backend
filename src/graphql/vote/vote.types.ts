import { objectType, enumType } from "nexus";
import { Context } from "types";

export const VoteType = enumType({
  name: "VoteType",
  members: ["UPVOTE", "DOWNVOTE"],
});

export const Vote = objectType({
  name: "Vote",
  // isTypeOf: (data) => {
  //   const isTypeValid = "post" in data ? true : false;

  //   return isTypeValid;
  // },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.field("type", { type: VoteType });
    t.nonNull.dateTime("createdAt");
    t.field("votedBy", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.vote
          .findUnique({ where: { id: parent.id } })
          .votedBy();
      },
    });
    t.field("post", {
      type: "Post",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.vote
          .findUnique({ where: { id: parent.id } })
          .post();
      },
    });
  },
});

// export const Vote = objectType({
//   name: "Vote",
//   definition: (t) => {
//     t.nonNull.string("id");
//     t.nonNull.field("type", { type: VoteType });
//     t.nonNull.dateTime("createdAt");
//     t.nonNull.dateTime("updatedAt");
//     t.nonNull.field("votedBy", { type: "User" });
//     t.nonNull.field("post", { type: "Post" });
//   },
// });
