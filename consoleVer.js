const fs = require('fs');
const path = require('path');
const shorten = require("./shorten.js");

fs.readFile(__dirname+'/console-input.txt', 'utf8', function(err, res){
    console.log(shorten(res, 4));
});