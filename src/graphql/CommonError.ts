import { objectType } from "nexus";

export const CommonError = objectType({
  name: "CommonError",
  isTypeOf: (data) => {
    const isTypeValid = "message" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("message");
  },
});
