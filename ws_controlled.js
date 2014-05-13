var qt = require('node-qt');
var WebSocketServer = require('ws').Server;

var PingPong = {
  
  qtWindow: null,
  p: null,
  
  BOARD_WIDTH: 800,
  BOARD_HEIGHT: 600,
  PADDLE_WIDTH: 100,
  
  handleOne: 1,
  handleTwo: 1,
  
  repaintBoard: function(){
	PingPong.p.begin(PingPong.qtWindow);
		
	PingPong.p.fillRect(PingPong.handleOne, 10, PingPong.PADDLE_WIDTH, 25, new qt.QColor(0, 99, 204));
	PingPong.p.fillRect(PingPong.handleTwo, 565, 100, 25, 8);
	    
	PingPong.p.end();	  
  },  
  
  updatePlayerPaddle: function(player, coordPercent){
	  var newPos = (PingPong.BOARD_WIDTH * coordPercent) - (PingPong.PADDLE_WIDTH / 2);
	  
	  if( player == "1" ){
		  PingPong.handleOne = newPos;
	  }else{
		  PingPong.handleTwo = newPos;
	  }
	  
	  PingPong.qtWindow.update();
  },
  
  wsOnMessage: function(message) {
	  
	  message = JSON.parse(message);
	  
	  switch( message.type ){
	  	case "move":
	  		PingPong.updatePlayerPaddle(message.player, message.pos);
		  break;
	  	default: break;
	  }
	  
  },
  
  init: function(){
    var app = new qt.QApplication();
    var wss = new WebSocketServer({port: 8080});
    
    wss.on('connection', function(ws) {
        ws.on('message', PingPong.wsOnMessage);
    });
    
    PingPong.qtWindow = new qt.QWidget;
    PingPong.p = new qt.QPainter();
    
    PingPong.qtWindow.paintEvent(PingPong.repaintBoard);
    
    PingPong.qtWindow.resize(PingPong.BOARD_WIDTH, PingPong.BOARD_HEIGHT);
    PingPong.qtWindow.show();       
    
    global.qtWindow = PingPong.qtWindow;
    
    setInterval(function() {app.processEvents();}, 0);
  }
  
};

PingPong.init();