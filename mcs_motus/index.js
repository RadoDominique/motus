"use strict";
/// <reference path="./declarations.d.ts" />
exports.__esModule = true;
var auth = require("./auth");
var mustacheExpress = require('mustache-express');
var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require("cookie-parser");
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
var port = process.env.PORT || 3005;
var fs = require('fs');
var date = new Date();
var dateJour = date.getDate();
var os = require("os");
var dirname = require('path').dirname;
var hostname = os.hostname();
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(express.static('ww_auth'));
// cookie parser middleware
app.use(cookieParser());
// OPEN ID //
// initialises the Issuer and the Client
app.use(auth.initialize);
// Deals with the user session
app.use(auth.session);
// Adds the OAuth / OpenId necessary routes.
app.use(auth.routes());


app.get("/", function (req, res) {
    res.redirect("/register.html");
});

// OPEN ID //
app.get("/private", auth.requireAuth, function (req, res) {
    // This is the main high level hook for the user
    // session, we will be building this later
    // console.log(req.session)
    // res.send(JSON.stringify(req.ses))
    var claims = req.session.tokenSet.claims();
    // render private.mustache and interpolate
    // the following data
    res.render("private", {
        email: claims.email,
        picture: claims.picture,
        name: claims.name
    });
});
var array = fs.readFileSync(__dirname + '/data/liste_francais_utf8.txt', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    //console.log(data);
    //res.end(data);
}).toString().split("\r\n");
//appel pour recuperer le mot
app.get('/wordguess', function (req, res) {
    var random = (dateJour * 12);
    res.send(array[random]);
});
app.listen(port, function () {
    console.log("Example app listening on port " + port);
});
//api /port
app.get('/port', function (req, res) {
    res.send("Motus App working on " + hostname + " on port " + port);
});

