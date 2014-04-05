// The physics space size is 640x480, with the origin in the bottom left.
// Its really an arbitrary number except for the ratio - everything is done
// in floating point maths anyway.

var GRABABLE_MASK_BIT = 1<<31;
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT;

if( typeof cp == 'undefined') {
	var cp = require("./cp.js");
}
    
var cpPong = function(){

    this.addDrawables();
    
    var ball = null, paddleOne = null, paddleTwo = null;    
    
    this.v = cp.v;
    this.space = new cp.Space();
        
    this.space.iterations = 60;
    this.space.gravity = this.v(0, 0);
    this.space.sleepTimeThreshold = 0.5;
    this.space.collisionSlop = 0.1; 
    
    this.addFloor();
    this.addWalls();
    
    var mass = 10;    
    var radius = 20;
        
    this.body = this.space.addBody( new cp.Body(mass, cp.momentForCircle(mass, 0, radius, this.v(0, 0))) );            
    this.ball = this.space.addShape( new cp.CircleShape(this.body, radius, this.v(0, 0)) );
    this.ball.setElasticity(1);    
    this.ball.setFriction(0.0);   
    this.ball.setCollisionType(1);
        
    this.paddleOneBody = this.space.addBody( new cp.Body(100000, cp.momentForBox(Infinity, 75, 10)) );        
    this.paddleOne = this.space.addShape( new cp.BoxShape(this.paddleOneBody, 75, 10) ); 
    this.paddleOne.setElasticity(1);
    this.paddleOne.setFriction(0);         

    this.paddleTwoBody = this.space.addBody( new cp.Body(100000, cp.momentForBox(Infinity, 75, 10)) );        
    this.paddleTwo = this.space.addShape( new cp.BoxShape(this.paddleTwoBody, 75, 10) ); 
    this.paddleTwo.setElasticity(1);
    this.paddleTwo.setFriction(0);        
        
    var self = this;    
        
    this.resetGameObjects();
    this.isRunning = true;
    this.run();
    
    /*
    this.space.setDefaultCollisionHandler(null, null, function(el){     	    	
        if( el.a.isGameEnder || el.b.isGameEnder ){        	        	
        	var pointFor = el.a.pointFor ? el.a.pointFor : el.b.pointFor;
        	scoreboard[ pointFor ] += 1;
        	
        	$("#scoreboard").html( scoreboardTemplate(scoreboard) );
        	
        	self.isRunning = false;
            alert("Round over!");
            
            window.setTimeout(function(){
            	self.resetGameObjects();
                self.isRunning = true;
                self.run();
            }, 3000);
        }        
    });          
        
    */ 
};

cpPong.prototype.resetGameObjects = function(){
    this.body.setPos( this.v(20, 320) );
    this.body.setVel( this.v(200, -200) );
    
    this.paddleOneBody.setPos( this.v(320, 60) );
    this.paddleTwoBody.setPos( this.v(320, 420) );
    
    this.paddleOneBody.setVel( this.v(0, 0) );
    this.paddleTwoBody.setVel( this.v(0, 0) );		
};

cpPong.prototype.addFloor = function() { 	
    this.floor = this.space.addShape( new cp.SegmentShape(this.space.staticBody, this.v(0, 0), this.v(640, 0), 0) );
    this.floor.setElasticity(1);
    this.floor.setFriction(0.0);    
    this.floor.setCollisionType(1);
    
    this.floor.isGameEnder = true;
    this.floor.pointFor = "s1";
    this.floor.lineWidth = 5;
    
    this.ceiling = this.space.addShape( new cp.SegmentShape(this.space.staticBody, this.v(0, 480), this.v(640, 480), 0) );
    this.ceiling.setElasticity(1);
    this.ceiling.setFriction(0.0);    
    this.ceiling.setCollisionType(1);
    
    this.ceiling.isGameEnder = true;
    this.ceiling.pointFor = "s2";
    this.ceiling.lineWidth = 5;
};

cpPong.prototype.addWalls = function() {
    var space = this.space;
    
    var wall1 = space.addShape(new cp.SegmentShape(space.staticBody, this.v(0, 0), this.v(0, 480), 0));
    wall1.setElasticity(1);
    wall1.setFriction(0.0);
    wall1.setLayers(NOT_GRABABLE_MASK);
    wall1.setCollisionType(1);
    wall1.lineWidth = 5;
    
    var wall2 = space.addShape(new cp.SegmentShape(space.staticBody, this.v(640, 0), this.v(640, 480), 0));
    wall2.setElasticity(1);
    wall2.setFriction(0.0);
    wall2.setLayers(NOT_GRABABLE_MASK);
    wall2.setCollisionType(1);
    wall2.lineWidth = 5;
};

//Export the Underscore object for **Node.js**, with
// backwards-compatibility for the old `require()` API. If we're in
// the browser, add `_` as a global object via a string identifier,
// for Closure Compiler "advanced" mode.
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = cpPong;
  }
  exports.cpPong = cpPong;
} else {
  window.cpPong = cpPong;
}