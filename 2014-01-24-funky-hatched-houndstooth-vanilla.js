// See http://jsbin.com/ObOTADo/4/edit?js,output

 var c=document.getElementById("myCanvas");
 var context=c.getContext("2d");

var width = window.innerWidth;
var height = window.innerHeight;

c.width = width;
c.height = height;

var centerX = width/2;
var centerY = height/2;
context.translate(centerX, centerY);

var rot = 10;
var increment = 2*Math.PI/rot;       
var theta = increment;

var draw = function () {

  context.clearRect(-centerX,-centerY,width,height);
  
  var x, y;
  context.beginPath();
  while( theta < 200*Math.PI) {
    x = theta * Math.cos(theta); 
    y = theta * Math.sin(theta); 
    context.lineTo(x, y);
    theta = theta + increment;
  }
  theta += 0.1;
  while( theta > 0) {
    x = theta * Math.cos(theta); 
    y = theta * Math.sin(theta); 
    context.lineTo(x, y);
    theta = theta - increment;
  }
  context.fill();
  
  increment = increment + 0.0001;
  theta = 0;
  
};
  
  
setInterval(draw, 1000/60);
