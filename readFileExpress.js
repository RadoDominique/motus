const express = require('express')
const app = express();
const port = process.env.PORT || 3005 ;
const fs = require('fs');
const date = new Date();
const dateJour = date.getDate();
var os = require("os");
const { dirname } = require('path');
var hostname = os.hostname();

app.use(express.static('ww'));

app.use((req,res,next)=>{
 // console.log(req.path)
  next()
})

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
    const random = (dateJour*10);
  res.send(array[random]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//api /port
app.get('/port', (req, res) => {
  res.send("Motus App working on "+hostname+" on port "+port);
})