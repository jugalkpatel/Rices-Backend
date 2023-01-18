"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Password = void 0;
const nexus_1 = require("nexus");
exports.Password = (0, nexus_1.objectType)({
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
            resolve: (parent, args, context) => {
                return context.prisma.password
                    .findUnique({ where: { id: parent.id } })
                    .user();
            },
        });
    },
});
//# sourceMappingURL=password.types.js.map