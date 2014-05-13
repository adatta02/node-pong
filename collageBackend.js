var _ = require("./underscore-min.js");
var fs = require("fs");
var http = require("http");

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
	
    ws.on('message', function(message) {
    	
    	message = JSON.parse(message);
    	if( message.type == "download" ){
    		
    		var file = fs.createWriteStream("downloaded_images/someimage.png");
    		var request = http.get(message.url, function(response) {
    		  response.pipe(file);
    		  message.targetUrl = "downloaded_images/someimage.png";
    		  ws.send( JSON.stringify(message) );
    		});    		
    		
    	}
    	
    });
    
});