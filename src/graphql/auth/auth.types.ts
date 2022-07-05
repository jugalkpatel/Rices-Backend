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
