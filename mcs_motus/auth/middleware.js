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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
var openid_client_1 = require("openid-client");
var cookie_1 = require("./cookie");
var session_1 = require("./session");
function getDomain() {
    return "http://" + process.env.HOST + ":" + process.env.PORT;
}
exports.getDomain = getDomain;
/*

Initialice two main things: the OpenId issuer and client,
these will be necessary for session management as
well as for authentication.

This is a direct dependency of the rest of the auth middlewares.


 */
function initialize(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var googleIssuer, client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (req.app.authIssuer) {
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, openid_client_1.Issuer.discover("https://accounts.google.com")];
                case 1:
                    googleIssuer = _a.sent();
                    console.log("OpendId issuer created");
                    client = new googleIssuer.Client({
                        client_id: process.env.OAUTH_CLIENT_ID,
                        client_secret: process.env.OAUTH_CLIENT_SECRET,
                        redirect_uris: [getDomain() + "/auth/callback"],
                        response_types: ["code"]
                    });
                    req.app.authIssuer = googleIssuer;
                    req.app.authClient = client;
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initialize = initialize;
/*

  This middleware deals with sessions, which involves
  - turning the auth cookie into a valid session object
  - storing that session object in req.auth.session for other parts of the app to use
  - refreshing the access_token if necessary

 */
function session(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var sessionCookie, client, session, refreshedTokenSet, err_1, validate, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sessionCookie = cookie_1.getSessionCookie(req);
                    if (!sessionCookie) {
                        return [2 /*return*/, next()];
                    }
                    client = req.app.authClient;
                    session = session_1.deserialize(sessionCookie);
                    if (!session.tokenSet.expired()) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.refresh(session.tokenSet)];
                case 2:
                    refreshedTokenSet = _b.sent();
                    session.tokenSet = refreshedTokenSet;
                    cookie_1.setSessionCookie(res, session_1.serialize(session));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    // this can throw when the refresh token has expired, logout completely when that happens
                    cookie_1.clearSessionCookie(res);
                    return [2 /*return*/, next()];
                case 4:
                    validate = (_a = req.app.authClient) === null || _a === void 0 ? void 0 : _a.validateIdToken;
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, validate.call(client, session.tokenSet)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _b.sent();
                    console.log("bad token signature found in auth cookie");
                    return [2 /*return*/, next(new Error("Bad Token in Auth Cookie!"))];
                case 8:
                    req.session = session;
                    next();
                    return [2 /*return*/];
            }
        });
    });
}
exports.session = session;
/*
  Helper middleware to protect certain routes.
  This will make those routes to be accessible only
  by already authenticated users.

  This is a very primitive version, a more complex one should.
  accept params like `if unauthenticated redirect to ...`
 */
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            session = req.session;
            if (!session) {
                return [2 /*return*/, next(new Error("unauthenticated"))];
            }
            next();
            return [2 /*return*/];
        });
    });
}
exports.requireAuth = requireAuth;
