import { objectType, enumType, unionType, inputObjectType } from "nexus";
import { Context } from "types";

export const VoteType = enumType({
  name: "VoteType",
  members: ["UPVOTE", "DOWNVOTE"],
});

export const Vote = objectType({
  name: "Vote",
  isTypeOf: (data) => {
    const isTypeValid = "type" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.field("type", { type: VoteType });
    t.nonNull.dateTime("createdAt");
    t.field("voteUser", {
      type: "User",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.vote
          .findUnique({ where: { id: parent.id } })
          .voteUser();
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

export const VoteArgs = inputObjectType({
  name: "VoteArgs",
  definition: (t) => {
    t.nonNull.field("type", { type: VoteType });
    t.nonNull.string("postId");
    t.nonNull.string("communityId");
  },
});

export const VoteResponse = unionType({
  name: "VoteResponse",
  definition: (t) => {
    t.members("Vote", "CommonError");
  },
});
