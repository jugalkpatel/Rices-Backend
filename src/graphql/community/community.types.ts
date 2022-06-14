import { interfaceType, objectType, unionType } from "nexus";

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

// base community type
export const Community = objectType({
  name: "Community",
  isTypeOf: (data) => {
    const isTypeValid = "creator" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("ICommunity");
    t.nonNull.field("creator", { type: "User" });
    t.list.nonNull.field("members", { type: "User" });
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
    t.members("FetchCommunityResult", "CommunityError");
  },
});

// // fetchCommunityWithPosts
// export const fetchCommunityWithPostsResult = objectType({
//   name: "FetchCommunityWithPostsResult",
//   isTypeOf: (data) => {
//     const isTypeValid = "posts" in data ? true : false;

//     return isTypeValid;
//   },
//   definition: (t) => {
//     t.nonNull.string("id");
//     t.list.field("posts", { type: "IPostType" });
//   },
// });

// export const FetchCommunityWithPostsResponse = unionType({
//   name: "FetchCommunityWithPostsResponse",
//   definition: (t) => {
//     t.members("FetchCommunityWithPostsResult", "CommunityError");
//   },
// });

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
