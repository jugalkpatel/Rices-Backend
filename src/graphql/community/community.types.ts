import { objectType, list, unionType } from "nexus";

export const Community = objectType({
  name: "Community",
  isTypeOf: (data) => {
    const isTypeValid = "title" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    // t.field("moderators", { type: list("User") });
    t.nonNull.field("creator", { type: "User" });
    t.field("members", { type: list("User") });
    t.nonNull.dateTime("createdAt");
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

export const CommunityError = objectType({
  name: "CommunityError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
  },
});

export const CommunityResponse = unionType({
  name: "CommunityResponse",
  definition: (t) => {
    t.members("CommunityResult", "CommunityError");
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
    t.members("AllCommunities", "CommunityError");
  },
});
