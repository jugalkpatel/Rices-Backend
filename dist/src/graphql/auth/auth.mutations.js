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
exports.AuthMutation = void 0;
const nexus_1 = require("nexus");
const bcrypt = __importStar(require("bcryptjs"));
const utils_1 = require("../../utils");
exports.AuthMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition: (t) => {
        t.nonNull.field("login", {
            type: "UserResponse",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve: async (parent, args, context, info) => {
                try {
                    const { email, password } = args;
                    const { prisma, response } = context;
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user?.id) {
                        return { message: "user not available" };
                    }
                    const { tokenVersion } = user;
                    const userPassword = await prisma.password.findUnique({
                        where: { userId: user.id },
                    });
                    const isPasswordValid = await bcrypt.compare(password, userPassword?.password ?? "");
                    if (!isPasswordValid) {
                        return {
                            message: "Invalid e-mail or password",
                        };
                    }
                    (0, utils_1.setCookies)(response, user.id, tokenVersion);
                    return user;
                }
                catch (error) {
                    return { message: "unexpected error occurred while login" };
                }
            },
        });
        t.nonNull.field("register", {
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
                    return {
                        message: "something went wrong!",
                    };
                }
            },
        });
        t.nonNull.field("authenticate", {
            type: "UserResponse",
            resolve: async (parent, args, context, info) => {
                try {
                    const { prisma, response, userId } = context;
                    if (!userId) {
                        return { message: "user not available" };
                    }
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                    });
                    if (!user || !user?.id || userId !== user?.id) {
                        return { message: "user not found!" };
                    }
                    (0, utils_1.setCookies)(response, user.id, user.tokenVersion);
                    return user;
                }
                catch (error) {
                    console.log({ error });
                    return {
                        message: "unexpected error occurred while authenticating user",
                    };
                }
            },
        });
        t.nonNull.field("refresh", {
            type: "RefreshResponse",
            resolve: async (_root, _args, ctx) => {
                try {
                    const { prisma, response, userId, tokenVersion } = ctx;
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                    });
                    if (!user || userId !== user?.id) {
                        (0, utils_1.clearTokens)(response);
                        return { message: "user not found!" };
                    }
                    if (!tokenVersion ||
                        !user?.tokenVersion ||
                        !(0, utils_1.checkTokenVersion)(tokenVersion, user.tokenVersion)) {
                        (0, utils_1.clearTokens)(response);
                        return { message: "invalid token!" };
                    }
                    (0, utils_1.setCookies)(response, user.id, user.tokenVersion);
                    return { success: true };
                }
                catch (error) {
                    console.log({ error });
                    return { message: "unexpected error while refreshing token" };
                }
            },
        });
        t.nonNull.field("logout", {
            type: "LogoutResponse",
            resolve: (parent, args, context, info) => {
                try {
                    const { response } = context;
                    (0, utils_1.clearTokens)(response);
                    return { success: true };
                }
                catch (error) {
                    return { message: "error while logout user" };
                }
            },
        });
    },
});
// logout mutation
// clear tokens
// increase tokenversion by 1
// logout all-route
// clear tokens
// incrase tokenversion by 1
//# sourceMappingURL=auth.mutations.js.map