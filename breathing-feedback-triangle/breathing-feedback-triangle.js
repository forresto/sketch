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
const INHALE = 4;
const EXHALE = INHALE * 3;
const BREATHPERIOD = 8000;
const CYCLE = 16 * BREATHPERIOD;
const TAU = Math.PI * 2;
const START = Date.now();
const EASE = [
  0,
  0,
  1 / 24,
  1 / 12,
  1 / 11,
  1 / 10,
  1 / 9,
  1 / 8,
  1 / 7,
  1 / 6,
  1 / 5,
  1 / 4,
  1 / 3,
  1 / 2 - 1 / 7,
  1 / 2 - 1 / 8,
  1 / 2 - 1 / 9,
  1 / 2 - 1 / 10,
  1 / 2 - 1 / 11,
  1 / 2 - 1 / 12,
  1 / 2 - 1 / 24,
  1 / 2,
  1 / 2,
  1 / 2 + 1 / 24,
  1 / 2 + 1 / 12,
  1 / 2 + 1 / 11,
  1 / 2 + 1 / 10,
  1 / 2 + 1 / 9,
  1 / 2 + 1 / 8,
  1 / 2 + 1 / 7,
  1 - 1 / 3,
  1 - 1 / 4,
  1 - 1 / 5,
  1 - 1 / 6,
  1 - 1 / 7,
  1 - 1 / 8,
  1 - 1 / 9,
  1 - 1 / 10,
  1 - 1 / 11,
  1 - 1 / 12,
  1 - 1 / 24,
  1,
  1,
  1 - 1 / 24,
  1 - 1 / 12,
  1 - 1 / 11,
  1 - 1 / 10,
  1 - 1 / 9,
  1 - 1 / 8,
  1 - 1 / 7,
  1 - 1 / 6,
  1 - 1 / 5,
  1 - 1 / 4,
  1 - 1 / 3,
  1 / 2 + 1 / 7,
  1 / 2 + 1 / 8,
  1 / 2 + 1 / 9,
  1 / 2 + 1 / 10,
  1 / 2 + 1 / 11,
  1 / 2 + 1 / 12,
  1 / 2 + 1 / 24,
  1 / 2,
  1 / 2,
  1 / 2 - 1 / 24,
  1 / 2 - 1 / 12,
  1 / 2 - 1 / 11,
  1 / 2 - 1 / 10,
  1 / 2 - 1 / 9,
  1 / 2 - 1 / 8,
  1 / 2 - 1 / 7,
  1 / 3,
  1 / 4,
  1 / 5,
  1 / 6,
  1 / 7,
  1 / 8,
  1 / 9,
  1 / 10,
  1 / 11,
  1 / 12,
  1 / 24,
];

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

  // context.font = '150px serif';
  // context.fillText('🍩', WIDTH / 2, HEIGHT / 4);

  if (!interactive) {
    const count = timeElapsed / BREATHPERIOD;
    zoom = Math.sin(count * TAU) * EXHALE + EXHALE + INHALE;
    // rotation = Math.cos(timeElapsed / CYCLE * Math.PI) * Math.PI + Math.PI;
    const easeFrom = EASE[Math.floor(count) % EASE.length];
    const easeTo = EASE[Math.ceil(count) % EASE.length];
    const diff = easeTo - easeFrom;
    rotation =
      (easeFrom + (Math.cos((count % 1) * TAU / 2) / -2 + 0.5) * diff) * TAU;
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
