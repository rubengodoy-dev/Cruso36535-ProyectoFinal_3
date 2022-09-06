require('dotenv').config();
var express = require('express'); 
var app = express(); 
var server = require('http').Server(app); 

const PORT= process.env.PORT

app.use(express.static('public')); 

app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
}); 

server.listen(PORT, function() { 
  console.log(`Conectado http CLIENTE CHAT escuchando en ${server.address().port}`); 
});