import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

import { schemaWithPermissions } from "./schema";
import { context } from "./context";

const APP_SECRET = process.env.DATABSE_URL as string;

console.log(APP_SECRET);

(async () => {
  try {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer({
      context,
      schema: schemaWithPermissions,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({ app, path: "/" });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );

    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  } catch (error) {
    console.error({ error });
  }
})();
