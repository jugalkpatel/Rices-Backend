"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuery = void 0;
const nexus_1 = require("nexus");
exports.UserQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition: (t) => {
        t.nonNull.field("fetchUser", {
            type: "UserResponse",
            resolve: async (_root, args, context) => {
                try {
                    const { userId, prisma } = context;
                    if (!userId) {
                        return { message: "user not available!" };
                    }
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                    });
                    const posts = await prisma.post.findMany({
                        where: { community: { members: { every: { id: userId } } } },
                    });
                    if (!user || !user?.id) {
                        return { message: "something went wrong!" };
                    }
                    return user;
                }
                catch (error) {
                    return {
                        message: "something went wrong!",
                    };
                }
            },
        });
    },
});
//# sourceMappingURL=user.queries.js.map