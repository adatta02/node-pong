var qt = require('node-qt');

var PingPong = {
  
  qtWindow: null,
  p: null,
  
  lastShifts: [ [], [] ],
  handleOne: 350,
  handleTwo: 350,
  
  repaintBoard: function(){
	PingPong.p.begin(PingPong.qtWindow);
		
	PingPong.p.fillRect(PingPong.handleOne, 10, 100, 25, 8);
	PingPong.p.fillRect(PingPong.handleTwo, 565, 100, 25, 8);
	    
	PingPong.p.end();	  
  },
  
  refresh: function(){
	  
	  var oneShift = (Math.floor( Math.random() * 1 ) + 1);
	  var twoShift = (Math.floor( Math.random() * 1 ) + 1);
	  
	  if( PingPong.lastShifts[0].length == 0 || PingPong.lastShifts[0].length == 100 ){		  
		  PingPong.lastShifts[0] = [];
		  PingPong.lastShifts[1] = [];
		  
		  PingPong.lastShifts[0].push( Math.random() > .5 ? -1 : 1 );		  
		  PingPong.lastShifts[1].push( Math.random() > .5 ? -1 : 1 );		  
	  }
	  
	  var oShift = PingPong.lastShifts[0][ PingPong.lastShifts[0].length - 1 ];
	  var tShift = PingPong.lastShifts[1][ PingPong.lastShifts[1].length - 1 ];
	  
	  PingPong.lastShifts[1].push( tShift );
	  PingPong.lastShifts[0].push( oShift );
	  	  
	  PingPong.handleOne = PingPong.handleOne + (oneShift * oShift);
	  PingPong.handleTwo = PingPong.handleTwo + (twoShift * tShift);	  	 
	  
	  PingPong.handleOne = PingPong.handleOne < 0 ? 0 : PingPong.handleOne;
	  PingPong.handleTwo = PingPong.handleTwo < 0 ? 0 : PingPong.handleTwo;
	  
	  PingPong.qtWindow.update();  
  },
  
  init: function(){
    var app = new qt.QApplication();
    PingPong.qtWindow = new qt.QWidget;
    PingPong.p = new qt.QPainter();
    
    PingPong.qtWindow.paintEvent(PingPong.repaintBoard);
    
    PingPong.qtWindow.resize(800, 600);
    PingPong.qtWindow.show();       
    
    global.qtWindow = PingPong.qtWindow;
    
    setInterval(function() {
    	app.processEvents();
    }, 0);    
  }
  
};

PingPong.init();

setInterval(function(){
	PingPong.refresh();
},  1);