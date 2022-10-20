const http = require('http');
const express = require('express')
const app = express();
const sessions = require('express-session')
var bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
const {readFileSync, writeFileSyn, promises: fsPromises} = require('fs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

const port = process.env.PORT || 3006 ;
const fs = require('fs');

const { dirname } = require('path');

app.use(express.static('ww'));

/*
score_joueur = 0
app.get('/score',(req,res)=>{
  user = req.query.user
  res.send({user:user,score:10})
})
app.get('/getScore',(req,res)=>{
  user = req.query.user
  res.send({user:user,score:score_joueur})
})

*/

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3005', 'http://localhost:3006'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
});


app.get('/', (req, res) => {
  res.redirect("http://localhost:3006/index.html");
})

app.post('/scoreFinal', (req, res) => {
  test=req.body;

  var score_local = readFileSync('data.txt','utf-8').toString().split('\n');
  leScore = parseInt(test.test)
  var score_stored = score_local[0]
  var new_score = score_stored
  if (parseInt(test.test) ==1){
    new_score = parseInt(score_local)+1;
    console.log("Valeur du score du joueur: ",new_score)
    fs.writeFileSync('data.txt',`${new_score}`,'utf-8')
  }

  res.send({nouveau_score:new_score})
})
app.get('/scoreFinal', (req, res) => {
  test1 = fs.readFileSync('data.txt', 'utf-8').split('\n')[0];
  console.log("resultat du get/scoreFinal :",test1);
  res.send(test1);
})


app.listen(port, () => {
  console.log(`Score app listening on port ${port}`)
})