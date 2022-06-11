import { objectType, unionType } from "nexus";

// base community type
export const Community = objectType({
  name: "Community",
  isTypeOf: (data) => {
    const isTypeValid = "creator" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("banner");
    t.nonNull.string("picture");
    t.nonNull.field("creator", { type: "User" });
    t.list.nonNull.field("members", { type: "User" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.list.field("posts", { type: "Post" });
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

export const CommunityCreator = objectType({
  name: "CommunityCreator",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
  },
});

// GetCommunity Types
export const GetCommunityMember = objectType({
  name: "GetCommunityMember",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
  },
});

export const CommunityUser = objectType({
  name: "CommunityUser",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("picture");
  },
});

export const CommunityPost = objectType({
  name: "CommunityPost",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("content");
    t.nonNull.dateTime("createdAt");
    t.nonNull.field("postedBy", { type: "CommunityUser" });
  },
});

export const GetCommunityResult = objectType({
  name: "GetCommunityResult",
  isTypeOf: (data) => {
    const isTypeValid = "creator" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("description");
    t.nonNull.string("banner");
    t.nonNull.string("picture");
    t.nonNull.field("creator", { type: "CommunityCreator" });
    t.nonNull.list.field("members", { type: "GetCommunityMember" });
    t.list.field("posts", { type: "CommunityPost" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});

export const GetCommunityResponse = unionType({
  name: "GetCommunityResponse",
  definition: (t) => {
    t.members("GetCommunityResult", "CommunityError");
  },
});

// Join Community Types
export const JoinCommunityResponse = unionType({
  name: "JoinCommunityResponse",
  definition: (t) => {
    t.members("IJoinCommunityMember", "CommunityError");
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
    t.members("AllCommunities", "CommunityError");
  },
});
