import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("picture");
  },
});

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
