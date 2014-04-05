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
        this.space.step(1/60);
        
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
	    global.qtWindow.showMaximized();
	    
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
            this.drawLine(ctx, this.tc, cp.v.mult(this.body.rot, this.r).add(this.tc), 1);
        };                    
        
        cp.PolyShape.prototype.draw = function(ctx){
        	
        };
        
	},
	
	
};

_.extend( cpPong.prototype, qtBackend );

var cp = new cpPong();