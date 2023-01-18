"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTokenVersion = exports.verifyRefreshToken = exports.verifyAccessToken = exports.buildTokens = exports.signRefreshToken = exports.signAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
require("dotenv/config");
const ACCESS_SECRET = process.env.TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
// time for tokens: refresh token: 10Days, accessToken: 5 days
// verify token
// if refresh token expirese then clear tokens
// check user presence
// check token version
// compare token version on refresh token with the token version in db
// throw error is version doesn't match otherwise generate a new tokens
// generate a new refresh token if it almost expires
function signAccessToken(payload) {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "5d" });
}
exports.signAccessToken = signAccessToken;
function signRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "10d" });
}
exports.signRefreshToken = signRefreshToken;
function buildTokens(id, tokenVersion) {
    const accessToken = signAccessToken({ user: id });
    const refreshToken = signRefreshToken({ user: id, tokenVersion });
    return { accessToken: accessToken, refreshToken: refreshToken };
}
exports.buildTokens = buildTokens;
function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}
exports.verifyAccessToken = verifyAccessToken;
function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
exports.verifyRefreshToken = verifyRefreshToken;
function checkTokenVersion(tokenVersion, tokenVersionFromDB) {
    if (tokenVersion === tokenVersionFromDB) {
        return true;
    }
    return false;
}
exports.checkTokenVersion = checkTokenVersion;
//# sourceMappingURL=token-utils.js.map