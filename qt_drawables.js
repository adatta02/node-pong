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
	    
	    global.linePxmap = new qt.QPixmap(100, 100);
	    global.p = new qt.QPainter();
	    	    	    
	    global.qtWindow.showMaximized();	    	    
	    var boundDrawScene = _.bind(this.drawScene, this);
	    global.qtWindow.paintEvent(boundDrawScene);
	    
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
        
        cp.Shape.prototype.drawLine = function(ctx, a, b){        
            a = this.point2canvas(a); 
            b = this.point2canvas(b);                                  
            
            global.p.begin(global.qtWindow);
            global.p.fillRect( 0, 0, 10, 10, 8 );
            global.p.end();
            
            console.log( a );
            console.log( b );
        };
        
        cp.Shape.prototype.drawCircle = function(ctx, c, radius){
            var c = this.point2canvas(c);
                       
        }
        
        cp.SegmentShape.prototype.draw = function(ctx) {                                    
            var lineWidth = this.lineWidth ? this.lineWidth : Math.max(1, this.r * global.scale * 2);
            this.drawLine(ctx, this.ta, this.tb);
        };

        cp.CircleShape.prototype.draw = function(ctx) {               
            this.drawCircle(ctx, this.tc, this.r);            
            this.drawLine(ctx, this.tc, cp.v.mult(this.body.rot, this.r).add(this.tc));
        };                    
        
        cp.PolyShape.prototype.draw = function(ctx){
        	
        };
        
	},
	
	
};

_.extend( cpPong.prototype, qtBackend );

var cp = new cpPong();