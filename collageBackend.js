var _ = require("./underscore-min.js");
var fs = require("fs");
var http = require("http");

var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

var roomSockets = [];

wss.on('connection', function(ws) {
	
    ws.on('message', function(message) {
    	    	    	
    	message = JSON.parse(message);
    	
    	if( message.type == "register" ){
    		console.log( "adding to " + message.room );
    		roomSockets.push( {ws: ws, room: message.room} );
    		return;
    	}
    	
    	var openRoomSockets = _.filter(roomSockets, function(rm){
    		return rm.room == message.room && rm.ws.readyState == WebSocket.OPEN;
    	});
    	
    	if( message.type == "download" ){
    		    		
    		var path = "downloaded_images/" + message.room + "_" + Date.now();
    		var file = fs.createWriteStream( path );
    		    		
    		console.log( "fetching " + message.url + " to " + path );    		    		
    		    		
    		var request = http.get(message.url, function(response) {
    		  response.pipe(file);
    		  message.targetUrl = path;
    		  
    		  _.each(openRoomSockets, function(rm){
    			  var isOwn = rm.ws == ws ? true : false;
    			  var msg = _.extend({}, message, {isOwn: isOwn});
    			  
    			  rm.ws.send( JSON.stringify(msg) );
    			  
    		  });
    		  
    		});    		
    		
    	}
    	
    	if( message.type == "move" ){
    		var clients = _.filter(openRoomSockets, function(el){ return el.ws != ws; } );
    		_.each(clients, function(rm){
    			rm.ws.send( JSON.stringify(message) );
    		});
    	}
    	
    });
    
});