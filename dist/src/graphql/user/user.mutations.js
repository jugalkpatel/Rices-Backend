"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutations = void 0;
const nexus_1 = require("nexus");
const bcrypt = __importStar(require("bcryptjs"));
const utils_1 = require("../../utils");
exports.userMutations = (0, nexus_1.extendType)({
    type: "Mutation",
    definition: (t) => {
        t.nonNull.field("createUser", {
            type: "UserResponse",
            args: {
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { email, password, name } = args;
                    const { prisma, response } = context;
                    const isUserAlreadyRegistered = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (isUserAlreadyRegistered) {
                        return { message: "user is unavailable" };
                    }
                    const encryptedPassword = await bcrypt.hash(password, 10);
                    const picture = (0, utils_1.getProfileImg)();
                    const user = await prisma.user.create({
                        data: {
                            name,
                            email,
                            password: { create: { password: encryptedPassword } },
                            picture,
                        },
                    });
                    if (!user?.id) {
                        return {
                            message: "error occurred while creating user!",
                        };
                    }
                    const { tokenVersion } = user;
                    (0, utils_1.setCookies)(response, user.id, tokenVersion);
                    return user;
                }
                catch (error) {
                    console.log({ error });
                    return {
                        message: "something went wrong!",
                    };
                }
            },
        });
    },
});
//# sourceMappingURL=user.mutations.js.map