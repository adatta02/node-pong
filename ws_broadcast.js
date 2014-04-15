var _ = require("./underscore-min.js");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

var cp = require("./cp.js");
var cpPong = require("./cpPong.js");

var broadcasted = {
  run: function(){
      this.space.step(1/60);
      
      var self = this;
      // self.broadcastMessage( {"fn": "clearRect"} );
      
      this.space.eachShape(function(shape){
    	  if( shape.type == "circle" ){    		  
    		  self.broadcastMessage( { tc: shape.tc, r: shape.r, fn: "drawCircle" } );
    	  }
      });
      
      var boundRun = _.bind(this.run, this);      
      setTimeout(function(){boundRun();}, 30);	  
  },
  addDrawables: function(){
	  
  },
  resetGame: function(){
	  	  
  },
  alertRoundOver: function(){
	  
  },
  renderScoreBoard: function(){
	  
  },
  broadcastMessage: function(msg){
	  _.each(clients, function(ws){
		  ws.send( JSON.stringify(msg) );
	  });
  }
};

_.extend( cpPong.prototype, broadcasted );

var cpPongClient = new cpPong();
var clients = [ ];

wss.on('connection', function(ws) {
    
	clients.push( ws );
	
	ws.on('message', function(msg){
		console.log( msg );
    });
    
});

