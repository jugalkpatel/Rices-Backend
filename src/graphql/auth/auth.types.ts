import { objectType, unionType } from "nexus";

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
    const isTypeValid = "token" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("token");
    t.nonNull.field("user", { type: "User" });
  },
});

export const AuthResponse = unionType({
  name: "AuthResponse",
  definition: (t) => {
    t.members("AuthPayload", "AuthError");
  },
});
