const express = require('express')
const app = express();
const sessions = require('express-session')
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser')
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

const port = process.env.PORT || 3005 ;
const fs = require('fs');
const date = new Date();
const dateJour = date.getDate();
var os = require("os");
const { dirname } = require('path');
const { isSet } = require('util/types');
var hostname = os.hostname();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

//app.use(express.static('ww'))
/*
app.use((req, res, next) => {
  const allowedOrigin0s = ['http://localhost:3005', 'http://localhost:3006'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
});

*/

// SESSION
app.use(sessions({
  name: 'session',
  secret: "scrtkey",
  // keys: ['key1', 'key2'],
  cookie: {
    //secure: true,
    httpOnly: true,
    // domain: 'example.com',
    // path: 'foo/bar',
    expires: expiryDate
  },
  saveUninitialized: true,
  resave: false
}))

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static('ww_auth'));

// cookie parser middleware
app.use(cookieParser());

//username and password
const myusername = 'axel'
const mypassword = '92i'

// a variable to save a session
var session;

app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
    session=req.session;
    session.user=req.body.username;
    console.log(req.session)
    res.redirect('/front.html');
}
else{
    res.redirect('/login.html#invalid');
    console.log('Invalid username or password');
}
})

app.use((req,res,next )=> {
  console.log(req.session.user)
  if(!req.session.user){
    res.redirect('/login.html');
  }else{
    next();
  }
})

app.use(express.static('ww'));

app.get('/login',(req,res) =>{
  session = req.session;  
  if(session.userid){
    res.send("Bienvenue joueur,<a href=\'/logout'>click to logout</a>");
  }else
  res.sendFile('/login.html',{root:__dirname})
})

app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/login');
});


app.get("/",(req,res)=>{
  res.send('ok')
})

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

Word_found = {}
app.post('/wordFound', (req, res) => {
  Word_found = req.body;
  console.log(Word_found);
  res.send(Word_found);
})
app.get('/wordFound', (req, res) => {
  if( Word_found && Word_found.word_found){
    console.log(`testtttttt ${Word_found.word_found}`);
    res.send(Word_found).word_found;
  }
  else{
    res.send('ko')
  }
})
/*
//connexion entre 2 serveurs
app.get('/score',(req,res)=>{
  var http = require('http');

var options = {
  host: 'localhost',
  port:3006,
  path: '/score?user='+req.session.user
};

callback = function(response) {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    res.send(str);
  });
}

http.request(options, callback).end();
})

/*
app.post('/score', (req, res) => {
  score = req.body;
  console.log(score);
  res.send(score);
})
*/



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//api /port
app.get('/port', (req, res) => {
  res.send("Motus App working on "+hostname+" on port "+port);
})