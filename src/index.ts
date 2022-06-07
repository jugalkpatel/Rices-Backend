import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

import { schemaWithPermissions } from "./schema";
import { context } from "./context";
import { getProfileImg } from "./utils";

(async () => {
  try {
    const app = express();
    app.use(cookieParser());

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
      context,
      schema: schemaWithPermissions,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({
      app,
      path: "/",
      cors: {
        credentials: true,
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      },
    });

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
