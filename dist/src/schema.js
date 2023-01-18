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
exports.schemaWithPermissions = exports.baseSchema = void 0;
const nexus_1 = require("nexus");
const graphql_shield_1 = require("graphql-shield");
const graphql_middleware_1 = require("graphql-middleware");
const path_1 = require("path");
require("dotenv/config");
const types = __importStar(require("./graphql"));
const middlewares_1 = require("./middlewares");
const permissions = (0, graphql_shield_1.shield)({
    Query: {
        fetchUser: middlewares_1.isAuthenticated,
        fetchAllUserPostsByTime: middlewares_1.isAuthenticated,
        fetchAllUserPostsByVote: middlewares_1.isAuthenticated,
        fetchUserBookmarks: middlewares_1.isAuthenticated,
    },
    Mutation: {
        authenticate: middlewares_1.isAuthenticated,
        refresh: middlewares_1.isRefreshTokenValid,
        createPost: middlewares_1.isAuthenticated,
        createComment: (0, graphql_shield_1.chain)(middlewares_1.isAuthenticated, middlewares_1.isUserEligibileForComment),
        createCommunity: middlewares_1.isAuthenticated,
        joinCommunity: middlewares_1.isAuthenticated,
        leaveCommunity: middlewares_1.isAuthenticated,
        createBookmark: middlewares_1.isAuthenticated,
        removeBookmark: middlewares_1.isAuthenticated,
        vote: (0, graphql_shield_1.chain)(middlewares_1.isAuthenticated, middlewares_1.isUserEligibleForVote),
        removeVote: (0, graphql_shield_1.chain)(middlewares_1.isAuthenticated, middlewares_1.validateRemoveVote),
        voteComment: middlewares_1.isAuthenticated,
        removeCommentVote: middlewares_1.isAuthenticated,
        logout: middlewares_1.isAuthenticated,
    },
}, { debug: true, allowExternalErrors: true });
exports.baseSchema = (0, nexus_1.makeSchema)({
    types,
    outputs: {
        schema: (0, path_1.join)(process.cwd(), "schema.graphql"),
        typegen: (0, path_1.join)(process.cwd(), "nexus-typegen.ts"),
    },
    contextType: {
        module: (0, path_1.join)(process.cwd(), "./src/context.ts"),
        export: "Context",
    },
    features: {
        abstractTypeStrategies: {
            isTypeOf: true,
        },
    },
});
exports.schemaWithPermissions = (0, graphql_middleware_1.applyMiddleware)(exports.baseSchema, permissions);
//# sourceMappingURL=schema.js.map