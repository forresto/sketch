/**
 *
 * war.js (wtfpl) 2023 forresto
 *
 * it's "war" the card game, written with a few copilot prompts, and then mostly
 * rewritten by me b/c it did things in weird recursive ways that made animation
 * hard.
 *
 * started sketching in https://p5ai.app so there's some ChatGPT in there too.
 *
 * shuffling is deterministic, so you can put seeds in with a friend to see
 * whose shuffle is luckier.
 *
 */

const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];

const canvas = document.getElementById("peace");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let p1Seed,
  p2Seed,
  p1Hand,
  p2Hand,
  p1Rand,
  p2Rand,
  p1Pile,
  p2Pile,
  p1Won,
  p2Won,
  turbo;
let state = "drawing";

// Load card spritesheet
const cardImage = new Image();
cardImage.src = "./cards.png";
const cardBackImage = new Image();
cardBackImage.src = "./back.png";

function init() {
  p1Seed = document.querySelector("[name='p1']").value;
  p2Seed = document.querySelector("[name='p2']").value;

  p1Rand = makeRand(p1Seed);
  p2Rand = makeRand(p2Seed);

  let deck = [];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push({ value: values[j], num: j, suit: suits[i] });
    }
  }

  p1Hand = deck.slice(0, 26);
  p2Hand = deck.slice(26);

  p1Hand = shuffle(p1Hand, p1Rand);
  p2Hand = shuffle(p2Hand, p2Rand);

  p1Pile = [];
  p2Pile = [];
  p1Won = [];
  p2Won = [];

  const turboEl = document.getElementById("turbo");
  turboEl.addEventListener("change", function (e) {
    turbo = e.target.checked;
  });

  state = "drawing";
  animationLoop();
}
document.addEventListener("DOMContentLoaded", init);

function shuffle(deck, rand) {
  deck = deck.slice();
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getCardValue(card) {
  return card.num;
}

/* Checks if game can continue, adds cards to pile, and returns next state */
function draw(faceUp, next) {
  if (
    p1Hand.length + p1Won.length === 0 ||
    p2Hand.length + p2Won.length === 0
  ) {
    return "game over";
  }
  if (p1Hand.length === 0) {
    p1Hand = shuffle(p1Won, p1Rand);
    turnCards(p1Hand, false);
    p1Won = [];
  }
  if (p2Hand.length === 0) {
    p2Hand = shuffle(p2Won, p2Rand);
    turnCards(p2Hand, false);
    p2Won = [];
  }
  const p1Card = p1Hand.shift();
  p1Card.faceUp = faceUp;
  p1Pile.push(p1Card);
  const p2Card = p2Hand.shift();
  p2Card.faceUp = faceUp;
  p2Pile.push(p2Card);
  return next;
}

function getCardValue(card) {
  return card.num === 0 ? 13 : card.num;
}

function turnCards(cards, faceUp) {
  cards.forEach((card) => (card.faceUp = faceUp));
}

/* Advances the card state and returns the next state */
function step() {
  if (state === "drawing") {
    return draw(true, "compare");
  } else if (state === "compare") {
    const p1Card = p1Pile[p1Pile.length - 1];
    const p2Card = p2Pile[p2Pile.length - 1];
    const player1Value = getCardValue(p1Card);
    const player2Value = getCardValue(p2Card);

    if (player1Value > player2Value) {
      turnCards(p1Pile, true);
      turnCards(p2Pile, true);
      p1Won.push(...p1Pile, ...p2Pile);
      p1Pile = [];
      p2Pile = [];
      return "drawing";
    } else if (player2Value > player1Value) {
      turnCards(p1Pile, true);
      turnCards(p2Pile, true);
      p2Won.push(...p2Pile, ...p1Pile);
      p1Pile = [];
      p2Pile = [];
      return "drawing";
    } else {
      return draw(false, "bet 1");
    }
  } else if (state === "bet 1") {
    return draw(false, "bet 2");
  } else if (state === "bet 2") {
    return draw(false, "bet 3");
  } else if (state === "bet 3") {
    return draw(true, "compare");
  } else if (state === "game over") {
    turnCards(p1Pile, true);
    turnCards(p2Pile, true);
    turnCards(p1Hand, true);
    turnCards(p2Hand, true);
    return "stop";
  }
}

function animationLoop() {
  state = step();
  if (state !== "stop") {
    if (turbo) {
      requestAnimationFrame(animationLoop);
    } else {
      const time = state === "drawing" ? 250 : state === "compare" ? 750 : 500;
      setTimeout(animationLoop, time);
    }
  }
  drawGame();
}

function drawGame() {
  ctx.clearRect(0, 0, width, height);
  ctx.font = "12px Verdana";
  ctx.fillStyle = "black";
  ctx.fillText(`p1: "${p1Seed}" ${p1Hand.length + p1Won.length}`, 25, 45);
  drawDeck(p1Hand, 25, 50);
  drawDeck(p1Won, 25 + p1Hand.length * 13, 50);
  ctx.fillStyle = "black";
  ctx.fillText(state, 25, 170);
  drawDeck(p1Pile, 25, 175);
  drawDeck(p2Pile, 25, 275);
  ctx.fillStyle = "black";
  ctx.fillText(`p2: "${p2Seed}" ${p2Hand.length + p2Won.length}`, 25, 395);
  drawDeck(p2Hand, 25, 400);
  drawDeck(p2Won, 25 + p2Hand.length * 13, 400);
}

function drawDeck(deck, x, y) {
  const cardOffset = 13;
  for (let i = 0; i < deck.length; i++) {
    drawCard(deck[i], x + i * cardOffset, y);
  }
}

function drawCard(card, x, y) {
  // Draw card image from spritesheet
  const { suit, num, value, faceUp } = card;
  if (faceUp) {
    const sx = suits.indexOf(suit) * 71;
    const sy = num * 96;
    ctx.drawImage(cardImage, sx, sy, 71, 96, x, y, 71, 96);
  } else {
    ctx.drawImage(cardBackImage, x, y);
  }
}

// Seeded rng
function makeRand(seed) {
  function cyrb128(str) {
    let h1 = 1779033703,
      h2 = 3144134277,
      h3 = 1013904242,
      h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [
      (h1 ^ h2 ^ h3 ^ h4) >>> 0,
      (h2 ^ h1) >>> 0,
      (h3 ^ h1) >>> 0,
      (h4 ^ h1) >>> 0,
    ];
  }
  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0;
      b >>>= 0;
      c >>>= 0;
      d >>>= 0;
      var t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
  const s = cyrb128(seed);
  return sfc32(s[0], s[1], s[2], s[3]);
}
