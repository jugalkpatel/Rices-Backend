"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenError = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
class TokenError extends apollo_server_errors_1.ApolloError {
    constructor(message) {
        super(message, "TOKEN_EXPIRED");
        Object.defineProperty(this, "name", { value: "TOKEN_EXPIRED_ERROR" });
    }
}
exports.TokenError = TokenError;
//# sourceMappingURL=errors.js.map