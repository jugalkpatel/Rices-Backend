import { booleanArg, objectType, unionType } from "nexus";

export const AuthError = objectType({
  name: "AuthError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.implements("CommonError");
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
    t.nonNull.field("user", { type: "User" });
  },
});

export const AuthResponse = unionType({
  name: "AuthResponse",
  definition: (t) => {
    t.members("AuthPayload", "AuthError");
  },
});

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
    t.members("IRefresh", "AuthError");
  },
});
