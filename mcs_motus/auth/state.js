"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var openid_client_1 = require("openid-client");
var encoding_1 = require("./encoding");
exports.STATE_COOKIE = "state";
function serializeAuthState(state) {
    // probably you would base64 encode this
    return encoding_1.toBase64(__assign(__assign({}, state), { bytes: openid_client_1.generators.state() }));
}
exports.serializeAuthState = serializeAuthState;
function deserializeAuthState(value) {
    return encoding_1.fromBase64(value);
}
exports.deserializeAuthState = deserializeAuthState;
function setAuthStateCookie(res, state) {
    res.cookie(exports.STATE_COOKIE, state, {
        maxAge: 15 * 60 * 1000,
        // no access from javascript
        httpOnly: true,
        // only access from our site
        // Unfortunately the cookie behavior has recently changed
        // and so we need to do this in order for the redirects to carry on our state cookie
        sameSite: false
    });
}
exports.setAuthStateCookie = setAuthStateCookie;
function getAuthStateCookie(req) {
    return req.cookies[exports.STATE_COOKIE];
}
exports.getAuthStateCookie = getAuthStateCookie;
