import { interfaceType } from "nexus";

export const CommonError = interfaceType({
  name: "CommonError",
  definition: (t) => {
    t.nonNull.string("message");
  },
});
