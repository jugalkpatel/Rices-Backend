"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonError = void 0;
const nexus_1 = require("nexus");
exports.CommonError = (0, nexus_1.objectType)({
    name: "CommonError",
    isTypeOf: (data) => {
        const isTypeValid = "message" in data ? true : false;
        return isTypeValid;
    },
    definition: (t) => {
        t.nonNull.string("message");
    },
});
//# sourceMappingURL=CommonError.js.map