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
function serialize(session) {
    return encoding_1.toBase64(session);
}
exports.serialize = serialize;
function deserialize(value) {
    var raw = encoding_1.fromBase64(value);
    return __assign(__assign({}, raw), { tokenSet: new openid_client_1.TokenSet(raw.tokenSet) });
}
exports.deserialize = deserialize;
