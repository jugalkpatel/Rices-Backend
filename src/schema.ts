import { makeSchema } from "nexus";
import { shield } from "graphql-shield";
import { applyMiddleware } from "graphql-middleware";
import { join } from "path";
import "dotenv/config";

import * as types from "./graphql";
import { isAuthenticated } from "./middlewares";

const permissions = shield(
  {
    Query: { user: isAuthenticated },
    Mutation: {},
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
