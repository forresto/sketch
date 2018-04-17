// Reset
document.body.style.margin = 0;
document.body.style.backgroundColor = 'black';

// Measure
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const RATIO = window.devicePixelRatio;

// Setup master canvas
const canvas = document.createElement('canvas');
canvas.width = WIDTH * RATIO;
canvas.height = HEIGHT * RATIO;
canvas.style.width = WIDTH + 'px';
canvas.style.height = HEIGHT + 'px';
const context = canvas.getContext('2d');
context.scale(RATIO, RATIO);

document.body.appendChild(canvas);

// Setup hidden canvas
const canvas2 = document.createElement('canvas');
canvas2.width = WIDTH * RATIO;
canvas2.height = HEIGHT * RATIO;
const context2 = canvas2.getContext('2d');
// context2.scale(RATIO, RATIO);

const PADDING_V = HEIGHT / 6;
const TRIHEIGHT = HEIGHT - PADDING_V * 2;
const PADDING_H = Math.max(
  WIDTH / 6,
  (WIDTH - TRIHEIGHT * 2 / Math.sqrt(3)) / 2
);
const TRIWIDTH = WIDTH - PADDING_H * 2;
const MAXZOOM = PADDING_V;
const MINZOOM = Math.max(WIDTH, HEIGHT) / 100;
const INHALE = 3;
const EXHALE = INHALE * 4;
const BREATHPERIOD = 8000;
const CYCLE = 16 * BREATHPERIOD;
const TAU = Math.PI * 2;
const START = Date.now();

let zoom = 5;
let rotation = 0;
let interactive = false;

// Feedback
function draw() {
  window.requestAnimationFrame(draw);

  context2.drawImage(canvas, 0, 0);

  context.fillStyle = 'black';
  context.fillRect(0, 0, WIDTH, HEIGHT);

  const timeElapsed = Date.now() - START;
  const hue = (timeElapsed / BREATHPERIOD / 2 * 360) % 360;
  context.strokeStyle = `hsla(${hue}, 100%, 75%, 1)`;

  const x = WIDTH / 2;
  const y = HEIGHT / 2;
  context.translate(x, y);
  context.rotate(rotation);
  context.drawImage(
    canvas2,
    zoom - WIDTH / 2,
    zoom - HEIGHT / 2,
    WIDTH - zoom * 2,
    HEIGHT - zoom * 2
  );
  context.rotate(-1 * rotation);
  context.translate(-1 * x, -1 * y);

  // Triangle
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(PADDING_H, HEIGHT - PADDING_V);
  context.lineTo(WIDTH / 2, PADDING_V);
  context.lineTo(WIDTH - PADDING_H, HEIGHT - PADDING_V);
  context.closePath();
  context.stroke();

  if (!interactive) {
    zoom = Math.cos(timeElapsed / BREATHPERIOD * TAU) * EXHALE + EXHALE + INHALE;
    rotation = Math.cos(timeElapsed / CYCLE * Math.PI) * Math.PI + Math.PI;
  }
}

window.requestAnimationFrame(draw);

window.addEventListener('mousemove', function(event) {
  if (!interactive) {
    return;
  }
  const {clientX, clientY} = event;
  zoom = (clientY - PADDING_V) / (HEIGHT - PADDING_V) * (MAXZOOM - MINZOOM);
  // Rotate around center, confusing with zoom connected to X
  // rotation = Math.atan2(clientX - WIDTH / 2, clientY - HEIGHT / 2);
  rotation = clientX / WIDTH * TAU + Math.PI;
  console.log({rotation, zoom});
});

window.addEventListener('click', function() {
  interactive = !interactive;
});
