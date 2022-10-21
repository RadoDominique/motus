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
var debug_1 = require("debug");
var express_1 = require("express");
var cookie_1 = require("./cookie");
var session_1 = require("./session");
var middleware_1 = require("./middleware");
var state_1 = require("./state");
var debug = debug_1["default"]("myapp:routes");
/*
  This is a simple middleware that hosts all the routes
  necessary to manage authentication. In here you are going
  to see the vital routes:
  - auth/login which inits the whole oAuth flow
  - auth/callback which is the thing that the openId provider will call to finish the auth process


  We are also including a logout route and others might be included
  such as a `userinfo` proxy among others.

 */
function authRoutesMiddleware() {
    var _this = this;
    var router = express_1.Router();
    router.get("/auth/login", function (req, res, next) {
        var backToPath = req.query.backTo || "/private";
        var state = state_1.serializeAuthState({ backToPath: backToPath });
        var authUrl = req.app.authClient.authorizationUrl({
            scope: "openid email profile",
            state: state
        });
        debug("setting state cookie %O", state);
        state_1.setAuthStateCookie(res, state);
        debug("redirecting to %s", authUrl);
        res.redirect(authUrl);
    });
    router.get("/auth/callback", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var state, backToPath, client, params, tokenSet, user, sessionCookie, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug("/auth/callback");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    console.log("req.cookies", req.cookies);
                    state = state_1.getAuthStateCookie(req);
                    debug("state %s", state);
                    backToPath = state_1.deserializeAuthState(state).backToPath;
                    debug("state %O", state_1.deserializeAuthState(state));
                    client = req.app.authClient;
                    params = client.callbackParams(req);
                    return [4 /*yield*/, client.callback(middleware_1.getDomain() + "/auth/callback", params, { state: state })];
                case 2:
                    tokenSet = _a.sent();
                    return [4 /*yield*/, client.userinfo(tokenSet)];
                case 3:
                    user = _a.sent();
                    sessionCookie = session_1.serialize({ tokenSet: tokenSet, user: user });
                    cookie_1.setSessionCookie(res, sessionCookie);
                    res.redirect(backToPath);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log("SOMETHING WENT WRONG", err_1);
                    return [2 /*return*/, next(err_1)];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    // This is a logout mostly local to our app, that means
    // that your session with the identity provider will be ketp intact.
    router.get("/auth/logout", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var client, tokenSet, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    client = req.app.authClient;
                    tokenSet = (_a = req.session) === null || _a === void 0 ? void 0 : _a.tokenSet;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.revoke(tokenSet.access_token)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _b.sent();
                    console.error("error revoking access_token", err_2);
                    return [3 /*break*/, 4];
                case 4:
                    cookie_1.clearSessionCookie(res);
                    res.redirect("/register.html");
                    return [2 /*return*/];
            }
        });
    }); });
    // This does not work, it looks like google doesn't provider
    // the necessary endpoints in the Discovery doc
    router.get("/auth/logout/sso", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var client, tokenSet, endSessionUrl;
        var _a;
        return __generator(this, function (_b) {
            client = req.app.authClient;
            tokenSet = (_a = req.session) === null || _a === void 0 ? void 0 : _a.tokenSet;
            cookie_1.clearSessionCookie(res);
            endSessionUrl = client.endSessionUrl();
            res.redirect(endSessionUrl);
            return [2 /*return*/];
        });
    }); });
    return router;
}
exports["default"] = authRoutesMiddleware;
