"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutResponse = exports.Success = exports.RefreshResponse = exports.IRefresh = void 0;
const nexus_1 = require("nexus");
exports.IRefresh = (0, nexus_1.objectType)({
    name: "IRefresh",
    isTypeOf: (data) => {
        const isTypeValid = "success" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.field("success", { type: "Boolean" });
    },
});
exports.RefreshResponse = (0, nexus_1.unionType)({
    name: "RefreshResponse",
    definition(t) {
        t.members("IRefresh", "CommonError");
    },
});
exports.Success = (0, nexus_1.objectType)({
    isTypeOf: (data) => {
        const isTypeValid = "success" in data ? true : false;
        return isTypeValid;
    },
    name: "Success",
    definition: (t) => {
        t.nonNull.field("success", { type: "Boolean" });
    },
});
exports.LogoutResponse = (0, nexus_1.unionType)({
    name: "LogoutResponse",
    definition: (t) => {
        t.members("Success", "CommonError");
    },
});
//# sourceMappingURL=auth.types.js.map