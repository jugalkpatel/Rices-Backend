import { interfaceType, objectType, unionType } from "nexus";
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

export const CommunityResponse = unionType({
  name: "CommunityResponse",
  definition: (t) => {
    t.members("Community", "CommonError");
  },
});

// old
export const ICommunity = interfaceType({
  name: "ICommunity",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.dateTime("createdAt");
    t.nonNull.string("banner");
    t.nonNull.string("description");
    t.nonNull.dateTime("updatedAt");
    t.nonNull.string("picture");
  },
});

export const CommunityResult = objectType({
  name: "CommunityResult",
  isTypeOf: (data) => {
    const isTypeValid = "id" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
  },
});

export const ICommunityResponse = unionType({
  name: "ICommunityResponse",
  definition: (t) => {
    t.members("CommunityResult", "CommonError");
  },
});

// Fetch Community Types
export const CommunityUser = objectType({
  name: "CommunityUser",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

export const CommunityPost = objectType({
  name: "CommunityPost",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

export const FetchCommunityResult = objectType({
  name: "FetchCommunityResult",
  isTypeOf: (data) => {
    const isTypeValid = "creator" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("ICommunity");
    t.nonNull.field("creator", { type: "CommunityUser" });
    t.nonNull.list.field("members", { type: "CommunityUser" });
    t.list.field("posts", { type: "IPostType" });
  },
});

export const FetchCommunityResponse = unionType({
  name: "FetchCommunityResponse",
  definition: (t) => {
    t.members("FetchCommunityResult", "CommonError");
  },
});

// Join Community Types
export const JoinCommunityResponse = unionType({
  name: "JoinCommunityResponse",
  definition: (t) => {
    t.members("IJoinCommunityMember", "CommonError");
  },
});

export const IJoinCommunityMember = objectType({
  name: "IJoinCommunityMember",
  isTypeOf: (data) => {
    const isTypeValid = "id" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
  },
});

export const JoinCommunityResult = objectType({
  name: "JoinCommunityResult",
  isTypeOf: (data) => {
    const isTypeValid = "members" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.list.field("members", { type: "IJoinCommunityMember" });
  },
});

export const AllCommunities = objectType({
  name: "AllCommunities",
  isTypeOf: (data) => {
    const isTypeValid = "communities" in data ? true : false;

    return isTypeValid;
  },
  definition(t) {
    t.nonNull.list.nonNull.field("communities", { type: "CommunityResult" });
  },
});

export const AllCommunitiesResponse = unionType({
  name: "AllCommunitiesResponse",
  definition(t) {
    t.members("AllCommunities", "CommonError");
  },
});
