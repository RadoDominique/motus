"use strict";
exports.__esModule = true;
/*

  This module deals with the auth cookie.
  We are using a very simple approach of storing
  the whole session object as a cookie so that it can be self contained.
  This fits well with horizontally scalable architectures such as microservices
  as oposed to the more traditional statefull session id. Both are valid, this
  one is much simpler.

  We are storing the session object stringified but a more common approach is to
  encode it to make it smaller such as using base64 encoding.

  This module ONLY deals with parsing the session object into a cookie and back
  into a session object and clearing it, no token management is done in this module.

 */
var SESSION_COOKIE = "AUTH";
function setSessionCookie(res, session) {
    res.cookie(SESSION_COOKIE, session, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 9000000)
    });
}
exports.setSessionCookie = setSessionCookie;
function getSessionCookie(req) {
    return req.cookies[SESSION_COOKIE];
}
exports.getSessionCookie = getSessionCookie;
function clearSessionCookie(res) {
    res.clearCookie(SESSION_COOKIE);
}
exports.clearSessionCookie = clearSessionCookie;
