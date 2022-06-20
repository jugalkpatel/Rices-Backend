import { objectType } from "nexus";
import { Context } from "types";

export const Password = objectType({
  name: "Password",
  isTypeOf: (data) => {
    const isTypeValid = "password" in data ? true : false;

    return isTypeValid;
  },
  definition: (t) => {
    t.nonNull.string("id");
    t.nonNull.string("password");
    t.field("user", {
      type: "User",
      resolve: (parent, args, context: Context) => {
        return context.prisma.password
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });
  },
});
