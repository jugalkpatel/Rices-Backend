"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
function context({ req, res, }) {
    return {
        prisma: exports.prisma,
        request: req,
        response: res,
        userId: "",
    };
}
exports.context = context;
//# sourceMappingURL=context.js.map