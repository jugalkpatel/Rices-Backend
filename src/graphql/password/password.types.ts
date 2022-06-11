import { objectType } from "nexus";

export const Password = objectType({
  name: "Password",
  isTypeOf: (data) => {
    const isTypeValid = "password" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("password");
    t.nonNull.field("user", { type: "User" });
  },
});
