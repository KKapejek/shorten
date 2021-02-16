const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const shorten = require('./shorten.js');

const app = express();
app.use(bodyParser());
app.use(express.static("express"));

const server = http.createServer(app);

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname+'/express/index.html'));
  });
  
app.post('/', function(req, res){
  var text = req.body.inputText;
  var range = req.body.range;
  var data = shorten(text, range);

  fs.readFile(__dirname+'/express/index.html', 'utf8', function(err, html){
    html = html.replace(/<textarea form="input" name="inputText" id="inputText" class="textForm" rows="20" placeholder="Input your text here"><\/textarea>/, `<textarea form="input" name="inputText" id="inputText" class="textForm" rows="20" placeholder="Input your text here">${text}</textarea>`)
    html = html.replace(/<input type="range" value=".*." min="2" max="6" name="range"/, `<input type="range" value="${range}" min="2" max="6" name="range"`)
    html = html.replace(/Skrócić do <output>.*.<\/output>/, `Skrócić do <output>${range}</output>`)

    html = html.replace(/<textarea name="outputText" id="outputText" class="textForm" rows="20"><\/textarea>/, `<textarea name="outputText" id="outputText" class="textForm" rows="20">${data.summary}</textarea>`)
    html = html.replace(/<span id="reducedBy">.*.<\/span>/, `<span id="reducedBy">${data.statReducedBy}</span>`)
    html = html.replace(/<span id="importantWords"><\/span>/, `<span id="importantWords">${data.statTopWords}</span>`)
    res.send(html);
  });
});  

const port = 3000;
server.listen(port);
console.debug('Server listening on http://localhost:' + port);