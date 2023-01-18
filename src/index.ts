import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

import { schemaWithPermissions } from "./schema";
import { context } from "./context";

const ORIGIN_1 = process.env.ORIGIN_1 as string;
const ORIGIN_2 = process.env.ORIGIN_2 as string;
console.log({ ORIGIN_1 });
console.log({ ORIGIN_2 });
(async () => {
  try {
    const app = express();
    app.use(cookieParser());

    const httpServer = http.createServer(app);

    const server = new ApolloServer({
      context,
      schema: schemaWithPermissions,
      introspection: true,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({
      app,
      path: "/",
      cors: {
        credentials: true,
        origin: [ORIGIN_1, ORIGIN_2],
      },
    });

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT || 3000 }, resolve)
    );

    console.log(`🚀 Server ready`);
  } catch (error) {
    console.error({ error });
  }
})();
