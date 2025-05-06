"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
var totp_generator_1 = require("totp-generator");
function getAccessTokenURL() {
    return __awaiter(this, void 0, void 0, function () {
        function cleanBuffer(e) {
            e = e.replace(/ /g, "");
            var t = new ArrayBuffer(e.length / 2);
            var n = new Uint8Array(t);
            for (var r = 0; r < e.length; r += 2) {
                n[r / 2] = parseInt(e.substring(r, r + 2), 16);
            }
            return n;
        }
        var secretSauce, base32FromBytes, secretCipherBytes, secretBytes, secret, res, timestamp, totp, currentTimestamp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secretSauce = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
                    base32FromBytes = function (e) {
                        var t = 0;
                        var n = 0;
                        var r = "";
                        for (var i = 0; i < e.length; i++) {
                            n = (n << 8) | e[i];
                            t += 8;
                            while (t >= 5) {
                                r += secretSauce[(n >>> (t - 5)) & 31];
                                t -= 5;
                            }
                        }
                        if (t > 0) {
                            r += secretSauce[(n << (5 - t)) & 31];
                        }
                        return r;
                    };
                    secretCipherBytes = [
                        12, 56, 76, 33, 88, 44, 88, 33, 78, 78, 11, 66, 22, 22, 55, 69, 54,
                    ].map(function (e, t) { return e ^ ((t % 33) + 9); });
                    secretBytes = new Uint8Array(cleanBuffer(Buffer.from(secretCipherBytes.join(""), "utf8").toString("hex")).buffer);
                    secret = base32FromBytes(secretBytes);
                    return [4 /*yield*/, fetch("https://open.spotify.com/server-time").then(function (e) {
                            return e.json();
                        })];
                case 1:
                    res = _a.sent();
                    timestamp = res["serverTime"];
                    totp = totp_generator_1.TOTP.generate(secret, {
                        algorithm: "SHA-1",
                        digits: 6,
                        period: 30,
                        timestamp: timestamp * 1000,
                    });
                    currentTimestamp = Math.floor(Date.now() / 1000);
                    return [2 /*return*/, "https://open.spotify.com/get_access_token?reason=transport&productType=web_player&totp=".concat(totp.otp, "&totpVer=5&ts=").concat(currentTimestamp)];
            }
        });
    });
}
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var tokenURL, request, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAccessTokenURL()];
                case 1:
                    tokenURL = _a.sent();
                    return [4 /*yield*/, fetch(tokenURL, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })];
                case 2:
                    request = _a.sent();
                    return [4 /*yield*/, request.json()];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/, {
                            accessToken: response["accessToken"],
                            expiresIn: response["accessTokenExpirationTimestampMs"],
                            clientId: response["clientId"],
                        }];
            }
        });
    });
}
