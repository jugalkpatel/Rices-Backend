import { objectType, unionType } from "nexus";

export const IRefresh = objectType({
  name: "IRefresh",
  isTypeOf: (data) => {
    const isTypeValid = "success" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.field("success", { type: "Boolean" });
  },
});

export const RefreshResponse = unionType({
  name: "RefreshResponse",
  definition(t) {
    t.members("IRefresh", "CommonError");
  },
});

export const Success = objectType({
  isTypeOf: (data) => {
    const isTypeValid = "success" in data ? true : false;

    return isTypeValid;
  },
  name: "Success",
  definition: (t) => {
    t.nonNull.field("success", { type: "Boolean" });
  },
});

export const LogoutResponse = unionType({
  name: "LogoutResponse",
  definition: (t) => {
    t.members("Success", "CommonError");
  },
});

// old
export const AuthUser = objectType({
  name: "AuthUser",
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("picture");
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  isTypeOf: (data) => {
    const isTypeValid = "user" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    // t.nonNull.string("token");
    t.nonNull.field("user", { type: "AuthUser" });
  },
});

export const AuthResponse = unionType({
  name: "AuthResponse",
  definition: (t) => {
    t.members("AuthPayload", "CommonError");
  },
});
