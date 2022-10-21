/// <reference path="./declarations.d.ts" />

import * as auth from "./auth";

const mustacheExpress = require('mustache-express')
const express = require('express')
const app = express();
const session = require('express-session')
const cookieParser = require("cookie-parser");
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

const port = process.env.PORT || 3005;
const fs = require('fs');
const date = new Date();
const dateJour = date.getDate();
var os = require("os");
const { dirname } = require('path');
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

//username and password
const myusername = 'axel'
const mypassword = '92i'


app.use(express.static('ww'));

app.get("/",(req,res)=>{
  res.redirect("/register.html");
})

// OPEN ID //

app.get("/private", auth.requireAuth, (req, res) => {
    // This is the main high level hook for the user
    // session, we will be building this later
    // console.log(req.session)
    // res.send(JSON.stringify(req.ses))
    const claims = req.session!.tokenSet.claims();
  
    // render private.mustache and interpolate
    // the following data
    res.render("private", {
      email: claims.email,
      picture: claims.picture,
      name: claims.name,
    });
});

var array = fs.readFileSync(__dirname+'/data/liste_francais_utf8.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    return;
  }
  //console.log(data);
  //res.end(data);

  }).toString().split("\r\n");

  //appel pour recuperer le mot
app.get('/wordguess', (req, res) => {
    const random = (dateJour*12);
  res.send(array[random]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//api /port
app.get('/port', (req, res) => {
  res.send("Motus App working on "+hostname+" on port "+port);
})