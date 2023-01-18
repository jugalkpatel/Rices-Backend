"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTokens = exports.setCookies = exports.CookieNames = void 0;
const utils_1 = require("../utils");
var CookieNames;
(function (CookieNames) {
    CookieNames["ACCESS"] = "ACCESS";
    CookieNames["REFRESH"] = "REFRESH";
})(CookieNames = exports.CookieNames || (exports.CookieNames = {}));
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
};
function setCookies(res, userId, tokenVersion) {
    const { accessToken, refreshToken } = (0, utils_1.buildTokens)(userId, tokenVersion);
    res.cookie(CookieNames.ACCESS, accessToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
    });
    res.cookie(CookieNames.REFRESH, refreshToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
    });
}
exports.setCookies = setCookies;
function clearTokens(res) {
    res.cookie(CookieNames.ACCESS, "", { ...cookieOptions, maxAge: 0 });
    res.cookie(CookieNames.REFRESH, "", { ...cookieOptions, maxAge: 0 });
}
exports.clearTokens = clearTokens;
//# sourceMappingURL=cookie-utils.js.map