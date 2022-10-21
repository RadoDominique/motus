"use strict";
exports.__esModule = true;
function fromBase64(value) {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}
exports.fromBase64 = fromBase64;
function toBase64(data) {
    return Buffer.from(JSON.stringify(data)).toString("base64");
}
exports.toBase64 = toBase64;
