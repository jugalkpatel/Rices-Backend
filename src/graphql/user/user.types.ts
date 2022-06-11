import { objectType, unionType } from "nexus";

export const UserError = objectType({
  name: "UserError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
  },
});

// base user type
export const User = objectType({
  name: "User",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("picture");
    t.nonNull.int("tokenVersion");
    t.nonNull.field("password", { type: "Password" });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
    t.list.field("joinedCommunities", { type: "Community" });
    t.list.field("communitiesCreated", { type: "Community" });
    t.list.field("posts", { type: "Post" });
    t.list.field("votes", { type: "Vote" });
    t.list.field("commentedOn", { type: "Comment" });
  },
});

// export const User = objectType({
//   name: "User",
//   definition: (t) => {
//     t.nonNull.string("id");
//     t.nonNull.string("name");
//     t.nonNull.string("email");
//     t.nonNull.string("picture");
//   },
// });

export const IUser = objectType({
  name: "IUser",
  definition: (t) => {
    t.nonNull.string("id");
  },
});

export const IUserQueryResult = objectType({
  name: "IUserQueryResult",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.list.field("joinedCommunities", { type: "IUser" });
  },
});

// for GetUserCommunities
export const IUserCommunity = objectType({
  name: "IUserCommunity",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("picture");
  },
});

export const IUserCommunities = objectType({
  name: "IUserCommunites",
  isTypeOf: (data) => {
    const isValidType = "communities" in data ? true : false;

    return isValidType;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.list.field("communities", { type: "IUserCommunity" });
  },
});

export const GetUserCommunitiesResponse = unionType({
  name: "GetUserCommunitiesResponse",
  definition: (t) => {
    t.members("IUserCommunites", "UserError");
  },
});
