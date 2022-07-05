import { objectType, unionType } from "nexus";
import { Context } from "types";

export const community = objectType({
  name: "Community",
  isTypeOf: (data) => {
    const isTypeValid = "description" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("banner");
    t.nonNull.string("description");
    t.nonNull.string("picture");
    t.nonNull.dateTime("createdAt");
    t.field("creator", {
      type: "User",
      resolve: (parent, args, context: Context) => {
        return context.prisma.community
          .findUnique({
            where: { id: parent.id },
          })
          .creator();
      },
    });
    t.nonNull.list.field("members", {
      type: "User",
      resolve: (parent, args, context: Context) => {
        return context.prisma.community
          .findUnique({
            where: { id: parent.id },
          })
          .members();
      },
    });
    t.list.field("posts", {
      type: "Post",
      resolve: (parent, args, context: Context, info) => {
        return context.prisma.community
          .findUnique({
            where: { id: parent.id },
          })
          .posts();
      },
    });
  },
});

export const communitylist = objectType({
  isTypeOf: (data) => {
    const isTypeValid = "communities" in data ? true : false;

    return isTypeValid;
  },
  name: "CommunityList",
  definition: (t) => {
    t.list.field("communities", { type: "Community" });
  },
});

export const CommunityListResponse = unionType({
  name: "CommunityListResponse",
  definition: (t) => {
    t.members("CommunityList", "CommonError");
  },
});

export const CommunityResponse = unionType({
  name: "CommunityResponse",
  definition: (t) => {
    t.members("Community", "CommonError");
  },
});
