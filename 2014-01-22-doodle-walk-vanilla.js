// See it: http://jsbin.com/AHUzosIy/1


// alt+8,9 []
// alt+shift+8,9 {}

// Get canvas from HTML
var canvas = document.getElementById("canvas");
// Get context from canvas. The context is where all of the drawing functions happen
var context = canvas.getContext("2d");

// DRY: don't repeat yourself
var width = 1080;
var height = 1080;

// Size the canvas
canvas.width = width;
canvas.height = height;

// Make an object
var character = {};

// Set the object's starting properties
character.x = width/2;
character.y = height/2;
character.hue = 0;

// All of our animation goes here
var draw = function(){
  // Clear all pixels
  //context.clearRect(0, 0, width, height);
  
  // Slowly fade to black
  //context.fillStyle = "rgba(0, 0, 0, 0.05)";
  //context.fillRect(0, 0, width, height);
  
  // Keep track of last position
  var lastX = character.x;
  var lastY = character.y;
  
  // Change current position randomly ±25
  character.x += Math.random()*50 - 25;
  character.y += Math.random()*50 - 25;
  
  // Don't get lost off of edges
  if (character.x > width) {
    character.x = width;
  }
  if (character.x < 0) {
    character.x = 0;
  }
  if (character.y > height) {
    character.y = height;
  }
  if (character.y < 0) {
    character.y = 0;
  }
  
  // Change hue
  character.hue += 1;
  if (character.hue > 360) {
    character.hue = 0;
  }

  // Draw line to middle
  // Adding strings and numbers makes the longer string
  // Canvas colors can be rgb, rgba, hsl, hsla, or hex
  context.strokeStyle = "hsla(" + (character.hue) + ",100%,50%,0.1)";
  context.beginPath();
  context.moveTo(width/2,height/2);
  context.lineTo(lastX,lastY);
  context.stroke();

  // Draw line to last position with opposite color
  context.strokeStyle = "hsla(" + (character.hue+180) + ",100%,50%,0.9)";
  context.beginPath();
  context.moveTo(lastX,lastY);  
  context.lineTo(character.x,character.y);
  context.stroke();

  // Draw small square  
  context.fillStyle = "hsl(" + character.hue + ",100%,50%)";
  context.fillRect(character.x-1, character.y-1,2,2);
};

// Make animation loop ("call draw 60 times per 1000ms")
setInterval(draw, 1000/60);




// Export PNG
document.getElementById("export").addEventListener("click", function(){
  window.open( canvas.toDataURL() );
});
