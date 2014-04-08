var qt = require('node-qt');
var _ = require("./underscore-min.js");

var cp = require("./cp.js");
var cpPong = require("./cpPong.js");

var qtBackend = {
		
	run: function(){
		
    	if( this.isRunning == false ){
    		return false;
    	}
    	        
        global.qtWindow.update();        
        this.space.step(1/30);
        
        var boundRun = _.bind(this.run, this);
        
        setTimeout(function(){boundRun();}, 0);
	},
		
	drawScene: function(){
		
		if( !this.space ){
			return;
		}
		
		var self = this;        
        this.space.eachShape(function(shape) {          
            shape.draw();       
        });
        
        var font = new qt.QFont();
        font.setPixelSize(24);
        
        global.p.begin(global.qtWindow);
        global.p.setFont( font );
        global.p.drawText(600, 40, "" + this.scoreboard.s1);
        global.p.drawText(600, 865, "" + this.scoreboard.s2);
        global.p.end();
                
     },
	
     resetGame: function(){
     	var self = this;
        setTimeout(function(){
             self.resetGameObjects();
             self.isRunning = true;
             self.run();
         }, 3000);    	
     },
     
     renderScoreBoard: function(){
     	
     },
     
     alertRoundOver: function(){
     	console.log("Round over!");
     },     
     
	addDrawables: function(){
		var app = new qt.QApplication();		
	    global.qtWindow = new qt.QWidget;
	    	    
	    global.p = new qt.QPainter();
	    
	    global.linePen = new qt.QPen( new qt.QBrush( 8 ), 5 );	    	    
	    global.thinPen = new qt.QPen( new qt.QBrush( 100 ), 1 );
	    global.ballPen = new qt.QPen( new qt.QBrush( 2 ), 5 );
	    
	    var boundDrawScene = _.bind(this.drawScene, this);
	    global.qtWindow.paintEvent(boundDrawScene);
	    
	    global.qtWindow.resize( 1200, 900 );
	    global.qtWindow.show();
	    // global.qtWindow.showMaximized();
	    
	    setInterval(function() {app.processEvents();}, 0);
	    
	    global.height = global.qtWindow.height();
	    global.width = Math.ceil( (height * 640) / 480 ) + 25;
	    
	    global.scale = 0;
        if (global.width / global.height > 640 / 480) {
        	global.scale = global.height / 480;
        } else {
        	global.scale = global.width / 640;
        } 
        
        cp.Shape.prototype.point2canvas = function(point){          
            return cp.v( point.x * global.scale, (480 - point.y) * global.scale );        	
        };
        
        cp.Shape.prototype.drawLine = function(ctx, a, b, lineWidth){        
            a = this.point2canvas(a); 
            b = this.point2canvas(b);                                  
                        
            var path = new qt.QPainterPath();
            var pen = lineWidth == 5 ? global.linePen : global.thinPen;
            
            path.moveTo( new qt.QPointF(a.x, a.y) );
            path.lineTo( new qt.QPointF(b.x, b.y) );
            
            global.p.begin(global.qtWindow);
            global.p.strokePath( path, pen );
            global.p.end();                        
        };
        
        cp.Shape.prototype.drawCircle = function(ctx, c, radius){
            var c = this.point2canvas(c);
            
            global.p.begin(global.qtWindow);
            
            global.p.setPen( global.ballPen );
            global.p.setBrush( new qt.QBrush( 2 ) );
            
            global.p.drawEllipse( new qt.QPointF(c.x, c.y), radius, radius );
            global.p.end();
        }
        
        cp.SegmentShape.prototype.draw = function(ctx) {                                    
            var lineWidth = this.lineWidth ? this.lineWidth : Math.max(1, this.r * global.scale * 2);
            this.drawLine(ctx, this.ta, this.tb, lineWidth);
        };

        cp.CircleShape.prototype.draw = function(ctx) {               
            this.drawCircle(ctx, this.tc, this.r);            
            // this.drawLine(ctx, this.tc, cp.v.mult(this.body.rot, this.r).add(this.tc), 1);
        };                    
        
        cp.PolyShape.prototype.draw = function(ctx){
        	
            var verts = this.tVerts; var len = verts.length;            
            var lastPoint = this.point2canvas( new cp.v( verts[len - 2], verts[len - 1] ) );
                                                           
            var path = new qt.QPainterPath();
            var pen = global.thinPen;                      
            path.moveTo( new qt.QPointF(lastPoint.x, lastPoint.y) );

            for(var i = 0; i < len; i+=2){
                var p = this.point2canvas(new cp.v(verts[i], verts[i+1]));
                path.lineTo( new qt.QPointF(p.x, p.y) );
            }        	
        	
            global.p.begin(global.qtWindow);            
            global.p.fillPath( path, new qt.QBrush( 2 ) );
            global.p.end(); 
            
        };
        
	},
	
	
};

_.extend( cpPong.prototype, qtBackend );

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

// cp.movePaddle("one", "right");

var cp;
var clients = [];

wss.on('connection', function(ws) {
	
	clients.push( ws );	
	
	if( clients.length == 2 ){
		cp = new cpPong();
	}
	
    ws.on('message', function(message) {    	
    	if( !cp ){
    		return;
    	}
    	
        console.log('received: %s', message);
        message = JSON.parse(message);
        
        if( message.type == "move" ){
        	cp.movePaddle(message.player, message.dir);
        }
        
    });
    
});