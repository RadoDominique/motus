"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var debug_1 = require("debug");
var openid_client_1 = require("openid-client");
__export(require("./middleware"));
var routes_1 = require("./routes");
exports.routes = routes_1["default"];
__export(require("./session"));
// A simple way of debugging openid-client requests
var debug = debug_1["default"]("myapp");
openid_client_1.custom.setHttpOptionsDefaults({
    headers: {
        // temporary workaround
        // for some reason the default user agent that this lib uses
        // breaks costar CA, so we need to force it to something else,
        // TODO maybe use something better than Postman's
        "User-Agent": "PostmanRuntime/7.26.5"
    },
    hooks: {
        beforeRequest: [
            function (options) {
                var method = options.method, url = options.url, headers = options.headers, body = options.body, form = options.form;
                debug(">>> Request %s %s", method.toUpperCase(), url.href);
                debug("Headers: %O", headers);
                debug("Body %O", body || form);
            },
        ],
        afterResponse: [
            function (response) {
                var statusCode = response.statusCode, headers = response.headers, body = response.body;
                var _a = response.request.options, method = _a.method, url = _a.url;
                debug("<<< Response %s %s", method.toUpperCase(), url.href);
                debug("Status %s", statusCode);
                debug("Headers: %O", headers);
                debug("Body %O", body);
                return response;
            },
        ]
    }
});
