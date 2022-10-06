const http = require('http');
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  
  const fs = require('fs');

  var array = fs.readFileSync('/data/Documents/Ing3/MCS/motus/data/liste_francais_utf8.txt', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
      return;
    }
    //console.log(data);
    //res.end(data);

    }).toString().split("\n");
  

  res.end(array[127]);


});
server.listen(port, () => {
  
  console.log(`Server running at http://localhost:${port}/`);
});