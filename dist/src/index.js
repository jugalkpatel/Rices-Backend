"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const schema_1 = require("./schema");
const context_1 = require("./context");
const ORIGIN_1 = process.env.ORIGIN_1;
const ORIGIN_2 = process.env.ORIGIN_2;
console.log({ ORIGIN_1 });
console.log({ ORIGIN_2 });
(async () => {
    try {
        const app = (0, express_1.default)();
        app.use((0, cookie_parser_1.default)());
        const httpServer = http_1.default.createServer(app);
        const server = new apollo_server_express_1.ApolloServer({
            context: context_1.context,
            schema: schema_1.schemaWithPermissions,
            introspection: true,
            plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
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
        await new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 3000 }, resolve));
        console.log(`🚀 Server ready`);
    }
    catch (error) {
        console.error({ error });
    }
})();
//# sourceMappingURL=index.js.map