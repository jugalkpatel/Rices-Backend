import { makeSchema } from "nexus";
import { shield, chain } from "graphql-shield";
import { applyMiddleware } from "graphql-middleware";
import { join } from "path";
import "dotenv/config";

import * as types from "./graphql";
import {
  isAuthenticated,
  isRefreshTokenValid,
  isUserEligibleForVote,
  validateRemoveVote,
  isUserEligibileForComment,
} from "./middlewares";

const permissions = shield(
  {
    Query: {
      fetchUser: isAuthenticated,
      fetchAllUserPosts: isAuthenticated,
    },
    Mutation: {
      authenticate: isAuthenticated,
      refresh: isRefreshTokenValid,
      createPost: isAuthenticated,
      createComment: chain(isAuthenticated, isUserEligibileForComment),
      createCommunity: isAuthenticated,
      joinCommunity: isAuthenticated,
      leaveCommunity: isAuthenticated,
      createBookmark: isAuthenticated,
      removeBookmark: isAuthenticated,
      vote: chain(isAuthenticated, isUserEligibleForVote),
      removeVote: chain(isAuthenticated, validateRemoveVote),
    },
  },
  { debug: true, allowExternalErrors: true }
);

export const baseSchema = makeSchema({
  types,
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"),
    export: "Context",
  },
  features: {
    abstractTypeStrategies: {
      isTypeOf: true,
    },
  },
});

export const schemaWithPermissions = applyMiddleware(baseSchema, permissions);
