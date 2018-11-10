// URL: https://beta.observablehq.com/@forresto/labyrinth
// Title: Labyrinth
// Author: Forrest Oliphant (@forresto)
// Version: 1790
// Runtime version: 1

const m0 = {
  id: "6b688f41041a357a@1790",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Labyrinth

tldr:`
)})
    },
    {
      name: "tldr",
      inputs: ["boardToPathEl","tldrBoard","tldrCols"],
      value: (function(boardToPathEl,tldrBoard,tldrCols){return(
boardToPathEl(tldrBoard, tldrCols, 9)
)})
    },
    {
      name: "tldrCols",
      inputs: ["width"],
      value: (function(width){return(
Math.floor(width / 28 / 2) * 2 + 1
)})
    },
    {
      name: "tldrBoard",
      inputs: ["solveAsync","makeInitialBoard","tldrCols"],
      value: (function(solveAsync,makeInitialBoard,tldrCols){return(
solveAsync('hello', makeInitialBoard(tldrCols, 9), tldrCols, 9)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Fun with space-filling curves

> "Then it seemed like falling into a labyrinth: we thought we were at the finish, but our way bent round and we found ourselves as it were back at the beginning, and just as far from that which we were seeking at first." ... Thus the present-day notion of a labyrinth as a place where one can lose [his] way must be set aside. It is a confusing path, hard to follow without a thread, but, provided [the traverser] is not devoured at the midpoint, it leads surely, despite twists and turns, back to the beginning.

– Socrates describing the labyrinthine line of a logical argument in Plato's dialogue Euthydemus


I've been doing a [few versions](https://twitter.com/forresto/status/879959151727837184) of this generative Labyrinth in the past few years. Each time I learn something new. I'm going to attempt to make a growing animated version, as a way to try _Observable_ & literate programming.

![photo cut labyrinth experiment](https://pbs.twimg.com/media/DDY-JqvXUAAKaS6.jpg:large)


`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
## How should we represent the data

Instead of starting with svg or canvas, I'm going to start by building up data that describes the labyrinth. I can then translate that same data to canvas, svg, or a string to visualize the process.

The last time that I made code to draw a labyrinth, the data for the intial board and path looked something like this:

\`\`\`
 →→↓
 ↑ ↓
 ↑←←
\`\`\`

Each space in the path (or board) points to the next. To decide if the labyrinth can grow in a particular direction, a segment in the path has to check its surroundings.

\`\`\`
 →→↓
→↑ ↓
↑←←←
\`\`\`

Each mutation to the path is optionally symmetrical.

\`\`\`
                      →↓
 →→→↓      →→→↓      →↑→↓
→↑ ↓←     →↑ ↓←     →↑ ↓←
↑←←←      ↑←↓←      ↑←↓←
           ↑←        ↑←
\`\`\`

I want to do things a little differently this time, though. I'm wondering if I could make something that could be more general than just 90° turns filling a square.

Or maybe, instead of the "linked-loop" data that I've been working with, I can try thinking in terms of [tiles](https://trasevol.dog/2017/09/01/di19/).

\`\`\`
 ╔╗
╔╬╝
╚╝
\`\`\`

`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Initial setup
## Index constants
Kinda wierd but...`
)})
    },
    {
      name: "KEY",
      value: (function(){return(
0
)})
    },
    {
      name: "CHAR",
      value: (function(){return(
1
)})
    },
    {
      name: "OVER",
      value: (function(){return(
2
)})
    },
    {
      name: "RIGHT",
      value: (function(){return(
3
)})
    },
    {
      name: "UNDER",
      value: (function(){return(
4
)})
    },
    {
      name: "LEFT",
      value: (function(){return(
5
)})
    },
    {
      name: "ROTATED",
      value: (function(){return(
6
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## TILES

I think this is like a simple [Tracery](http://www.tracery.io/) grammer or _Wave Form Collapse_ dictionary. Each tile decribes _what it will change to_ if the path is extended from it. For example, "right bottom (\`╔\`)" extended to the left will become "right bottom left (\`<╦\`)". 
`//SPACE = navigator.userAgent.toLowerCase().indexOf('android') > -1 ? '─' : ' '
)})
    },
    {
      name: "TILES",
      inputs: ["SPACE"],
      value: (function(SPACE){return(
[
  ['EMPTY', SPACE],
  // key, char, turns to if expand up, right, down, left, rotated 180°
  ['O',    '◽︎',    'T',    'R',    'B',    'L',    'O'], 
  ['T',    '╨',   null,   'TR',   'TB',   'TL',    'B'],
  ['R',    '╞',   'TR',   null,   'RB',   'RL',    'L'],
  ['B',    '╥',   'TB',   'RB',   null,   'BL',    'T'],
  ['L',    '╡',   'TL',   'RL',   'BL',   null,    'R'],
  ['RB',   '╔',  'TRB',   null,   null,  'RBL',   'TL'],
  ['BL',   '╗',  'TBL',  'RBL',   null,   null,   'TR'],
  ['TR',   '╚',   null,   null,  'TRB',  'TRL',   'BL'],
  ['TL',   '╝',   null,  'TRL',  'TBL',   null,   'RB'],
  ['TB',   '║',   null,  'TRB',   null,  'TBL',   'TB'],
  ['RL',   '═',  'TRL',   null,  'RBL',   null,   'RL'],
  ['TRB',  '╠',   null,   null,   null, 'TRBL',  'TBL'],
  ['TBL',  '╣',   null, 'TRBL',   null,   null,  'TRB'],
  ['TRL',  '╩',   null,   null, 'TRBL',   null,  'RBL'],
  ['RBL',  '╦', 'TRBL',   null,   null,   null,  'TRL'],
  ['TRBL', '╬',   null,   null,   null,   null, 'TRBL'],
  ['NEG', SPACE],
]
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`The index constants above and the \`TILE_INDEX\` below make it easier to answer questions like "if I extend the path to the left here, what does the tile to the right turn to?"
`
)})
    },
    {
      name: "TILE_INDEX",
      inputs: ["TILES","KEY"],
      value: (function(TILES,KEY)
{
  const tileIndexes = {}
  TILES.forEach((tile, index) => {
    tileIndexes[tile[KEY]] = index
  })
  return tileIndexes;
}
)
    },
    {
      name: "viewof boardSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="5" min="5" max="101" step="2">`
)})
    },
    {
      name: "boardSize",
      inputs: ["Generators","viewof boardSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "makeInitialBoard",
      inputs: ["TILE_INDEX"],
      value: (function(TILE_INDEX){return(
function (w, h = w) {
  const length = w * h
  const board = Array(length)
    .fill(TILE_INDEX.EMPTY)
  // Start loop in middle of board
  board[Math.floor(length / 2)] = TILE_INDEX.O
  return board
}
)})
    },
    {
      name: "initialBoard",
      inputs: ["makeInitialBoard","boardSize"],
      value: (function(makeInitialBoard,boardSize){return(
makeInitialBoard(boardSize)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Logging
For quick visual debugging`
)})
    },
    {
      name: "boardToString",
      inputs: ["boardSize","TILES","CHAR"],
      value: (function(boardSize,TILES,CHAR){return(
function boardToString (board, w = boardSize) {
  let str = ""
  if (!board || !board.forEach) return str
  board.forEach((tile, index) => {
    str += TILES[tile][CHAR]
    if ((index+1) % w === 0) {
      str += "\n"
    }
  })
  return str
}
)})
    },
    {
      name: "boardToEl",
      inputs: ["boardSize","html","boardToString"],
      value: (function(boardSize,html,boardToString){return(
function (board, w = boardSize, h = w) {
  return html`<pre style="font-size: 25px; line-height: 23px; padding: 0; border: 1px #eee solid; display: inline-block; height: ${h * 23 + 2}px; overflow-y: hidden;"}>${boardToString(board, w)}</pre>`
}
)})
    },
    {
      name: "demoBoard",
      value: (function(){return(
[
   6,  5,  6, 15,  7,  3,  7,
   8, 11,  9, 10,  8, 11,  9,
   3, 11,  7, 10,  6, 11,  5,
   4,  3, 16, 16, 16,  5,  4,
  12,  5,  2, 10,  2,  3, 13,
   8, 15,  5, 10,  3, 15,  9,
   0,  8, 11, 14, 11,  9,  0
]
)})
    },
    {
      name: "boardToElDemo",
      inputs: ["boardToEl","demoBoard"],
      value: (function(boardToEl,demoBoard){return(
boardToEl(demoBoard, 7)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### 🤔 Second order?

The "walls" in that string are actually the path... maybe expanding it would give a sense of the path better.`
)})
    },
    {
      name: "boardToPathString",
      inputs: ["SPACE","boardSize"],
      value: (function(SPACE,boardSize)
{

const fourChars =[
  [SPACE+SPACE
  ,SPACE+SPACE], // Space
  ['╔╗'
  ,'╚╝'], // O
  ['║║'
  ,'╚╝'], // T
  ['╔═'
  ,'╚═'], // R
  ['╔╗'
  ,'║║'], // B
  ['═╗'
  ,'═╝'], // L
  ['╔═'
  ,'║╔'], // RB
  ['═╗'
  ,'╗║'], // BL
  ['║╚'
  ,'╚═'], // TR
  ['╝║'
  ,'═╝'], // TL
  ['║║'
  ,'║║'], // TB
  ['══'
  ,'══'], // RL
  ['║╚'
  ,'║╔'], // TRB
  ['╝║'
  ,'╗║'], // TBL
  ['╝╚'
  ,'══'], // TRL
  ['══'
  ,'╗╔'], // RBL
  ['╝╚'
  ,'╗╔'], // TRBL
  [SPACE+SPACE
  ,SPACE+SPACE], // NEG
];
  
return function (board, w = boardSize) {
  let arr = [];
  let str = ""
  for (let i = 0, len = board.length; i < len; i++) {
    const tile = board[i];
    const row = Math.floor(i / w)
    for (let r = 0; r < 2; r++) {
      const strIndex = row * 2 + r
      if (!arr[strIndex]) {
        arr[strIndex] = ""
      }
      arr[strIndex] += fourChars[tile][r]
    }
  }
  return arr.join("\n")
}
}
)
    },
    {
      name: "boardToPathEl",
      inputs: ["boardSize","html","boardToPathString"],
      value: (function(boardSize,html,boardToPathString){return(
function (board, w = boardSize, h = w) {
  return html`<pre style="font-size: 20px; line-height: 15px; padding: 0; border: 1px #eee solid; display: inline-block; height: ${h * 2 * 15 + 2}px; overflow-y: hidden;"}>${boardToPathString(board, w)}</pre>`
}
)})
    },
    {
      inputs: ["boardToPathEl","demoBoard"],
      value: (function(boardToPathEl,demoBoard){return(
boardToPathEl(demoBoard, 7)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Monospace hack
Some systems don't size the box-drawing chararcters at the same width as other characters in a monospace element (ಠ_ಠ). Measure these to check, and decide if \`SPACE\` needs to be another box-drawing character:`
)})
    },
    {
      name: "spaceEl",
      inputs: ["html"],
      value: (function(html){return(
html`<span style="font-family: monospace;">_</span>`
)})
    },
    {
      name: "boxEl",
      inputs: ["html"],
      value: (function(html){return(
html`<span style="font-family: monospace;">╬</span>`
)})
    },
    {
      name: "SPACE",
      inputs: ["spaceEl","boxEl"],
      value: (function(spaceEl,boxEl){return(
spaceEl.getBoundingClientRect().width === boxEl.getBoundingClientRect().width ? ' ' : '─'
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Find possible directions to grow

We want all possibilities for a given board step before choosing one with the seeded random number generator. I'm ending up with something like a limited version of the Wave Form Collapse method:

> The neighboring tiles’ possibilities are reduced, according to their compatibility with their newly set neighbor, and then their neighbors’ tiles possibilities are reduced, etc until no more possibilities can be reduced.

– [Rémy 'Trasevol_Dog' Devaux](https://trasevol.dog/2017/09/01/di19/)
`
)})
    },
    {
      name: "findMutations",
      inputs: ["boardSize","TILE_INDEX","TILES","OVER","UNDER","LEFT","RIGHT"],
      value: (function(boardSize,TILE_INDEX,TILES,OVER,UNDER,LEFT,RIGHT){return(
function findMutations (board, w = boardSize, h = w) {
  const potentials = []
  for (let index = 0, len = board.length; index < len; index++) {
    const tile = board[index];

    if (tile !== TILE_INDEX.EMPTY) {
      continue;
    }
    
    const row = Math.floor(index / w)
    const col = index % w
    
    // Can this tile connect with the one under it?
    if (row < h - 1) {
      const underIndex = index + w
      const under = TILES[board[underIndex]]
      if (under[OVER]) {
        // A mutation is represented as [this index, this tile, that index, that change tile]
        potentials.push([index, UNDER, underIndex, TILE_INDEX[under[OVER]]])
      }
    }
    // Over
    if (row > 0) {
      const overIndex = index - w
      const over = TILES[board[overIndex]]
      if (over[UNDER]) {
        potentials.push([index, OVER, overIndex, TILE_INDEX[over[UNDER]]])
      }
    }
    // Right
    if (col < w - 1) {
      const rightIndex = index + 1
      const rightward = TILES[board[rightIndex]]
      if (rightward[LEFT]){
        potentials.push([index, RIGHT, rightIndex, TILE_INDEX[rightward[LEFT]]])
      }
    }
    // Left
    if (col > 0) {
      const leftIndex = index - 1
      const leftward = TILES[board[leftIndex]]
      if (leftward[RIGHT]){
        potentials.push([index, LEFT, leftIndex, TILE_INDEX[leftward[RIGHT]]])
      }
    }
  };
  return potentials;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Test it, step by step`
)})
    },
    {
      name: "initialMutations",
      inputs: ["findMutations","initialBoard"],
      value: (function(findMutations,initialBoard){return(
findMutations(initialBoard)
)})
    },
    {
      name: "stepCloneBoard",
      inputs: ["findMutations"],
      value: (function(findMutations){return(
function (board, randomGen) {
  const mutations = findMutations(board)
  const mutation = mutations[randomGen(mutations.length)]
  const out = board.slice()
  out[mutation[0]] = mutation[1]
  out[mutation[2]] = mutation[3]
  return out;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Change seed to change the demos:`
)})
    },
    {
      name: "viewof demoStepSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "demoStepSeed",
      inputs: ["Generators","viewof demoStepSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "demoStepGen",
      inputs: ["makeRandomGenerator","demoStepSeed"],
      value: (function(makeRandomGenerator,demoStepSeed){return(
makeRandomGenerator(demoStepSeed)
)})
    },
    {
      name: "firstStep",
      inputs: ["stepCloneBoard","initialBoard","demoStepGen"],
      value: (function(stepCloneBoard,initialBoard,demoStepGen){return(
stepCloneBoard(initialBoard, demoStepGen)
)})
    },
    {
      name: "firstStepEl",
      inputs: ["boardToEl","firstStep"],
      value: (function(boardToEl,firstStep){return(
boardToEl(firstStep)
)})
    },
    {
      name: "secondStep",
      inputs: ["stepCloneBoard","firstStep","demoStepGen"],
      value: (function(stepCloneBoard,firstStep,demoStepGen){return(
stepCloneBoard(firstStep, demoStepGen)
)})
    },
    {
      name: "secondStepEl",
      inputs: ["boardToEl","secondStep"],
      value: (function(boardToEl,secondStep){return(
boardToEl(secondStep)
)})
    },
    {
      name: "twelveSteps",
      inputs: ["makeRandomGenerator","demoStepSeed","initialBoard","boardToEl","stepCloneBoard","html"],
      value: (function(makeRandomGenerator,demoStepSeed,initialBoard,boardToEl,stepCloneBoard,html)
{
  const stepGen = makeRandomGenerator(demoStepSeed)
  let board = initialBoard
  const boardEls = [boardToEl(board)]
  for (let i=0; i < 11; i++) {
    board = stepCloneBoard(board, stepGen)
    boardEls.push(boardToEl(board))
  }
  return html`<div>${boardEls}</div>`
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Solve a board with a seed

Seems like that works 😄 ... let's try to fill a whole board. When you change the seed the board should change.`
)})
    },
    {
      name: "viewof boardDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "boardDemoSeed",
      inputs: ["Generators","viewof boardDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof boardDemoSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="9" min="3" max="101" step="1">`
)})
    },
    {
      name: "boardDemoSize",
      inputs: ["Generators","viewof boardDemoSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "solveSync",
      inputs: ["makeRandomGenerator","findMutations"],
      value: (function(makeRandomGenerator,findMutations){return(
function solveSync (seed, board, w, h = w) {
  const random = makeRandomGenerator(seed)
  let mutations = findMutations(board, w, h)
  while (mutations.length) {
    const mutation = mutations[random(mutations.length)]
    board[mutation[0]] = mutation[1]
    board[mutation[2]] = mutation[3]
    mutations = findMutations(board, w, h)
  }
  return board
}
)})
    },
    {
      name: "solvedEl",
      inputs: ["boardToPathEl","solveSync","boardDemoSeed","makeInitialBoard","boardDemoSize"],
      value: (function(boardToPathEl,solveSync,boardDemoSeed,makeInitialBoard,boardDemoSize){return(
boardToPathEl(solveSync(boardDemoSeed, makeInitialBoard(boardDemoSize), boardDemoSize), boardDemoSize)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Import \`makeRandomGenerator\`: a seeded random number generator ([random-seed](https://www.npmjs.com/package/random-seed) on npm, [demos and viz on Observable](https://beta.observablehq.com/@forresto/random-seed)):`
)})
    },
    {
      from: "@forresto/random-seed",
      name: "makeRandomGenerator",
      remote: "makeRandomGenerator"
    },
    {
      name: "viewof inputSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "inputSeed",
      inputs: ["Generators","viewof inputSeed"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Asynchronous generation and animation

Part of the inspiration to do another version of this generative thing was [Mike Bostock's Introduction to Asynchronous Iteration](https://beta.observablehq.com/@mbostock/introduction-to-asynchronous-iteration) article. I haven't gotten a chance to use these concepts in my everyday programming so far.

Also, it's fun to watch a labyrinth grow from the initial seed. Solving the labyrinth gets noticeably slow at sizes >30, so we might as well animate the solving instead of freezing the browser.

Change the seed to see it animate:
`
)})
    },
    {
      name: "viewof asyncDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "asyncDemoSeed",
      inputs: ["Generators","viewof asyncDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof asyncDemoSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="9" min="3" max="101" step="1">`
)})
    },
    {
      name: "asyncDemoSize",
      inputs: ["Generators","viewof asyncDemoSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "solveAsync",
      inputs: ["makeRandomGenerator","findMutations"],
      value: (function(makeRandomGenerator,findMutations){return(
async function* solveAsync (seed, board, w, h = w) {
  const random = makeRandomGenerator(seed)
  let mutations = findMutations(board, w, h)
  while (mutations.length) {
    const mutation = mutations[random(mutations.length)]
    board[mutation[0]] = mutation[1]
    board[mutation[2]] = mutation[3]
    mutations = findMutations(board, w, h)
    // This is optional... Observable already throttles to rAF
    // await Promises.delay(1000/60)
    yield board
  }
}
)})
    },
    {
      inputs: ["makeInitialBoard","asyncDemoSize","pauser","boardToPathEl","solveAsync","asyncDemoSeed"],
      value: (async function*(makeInitialBoard,asyncDemoSize,pauser,boardToPathEl,solveAsync,asyncDemoSeed)
{
  let board = makeInitialBoard(asyncDemoSize)
  yield* pauser(boardToPathEl(board, asyncDemoSize));
  const boardGen = solveAsync(asyncDemoSeed, board, asyncDemoSize)
  while (true) {
    const {done, value} = await boardGen.next();
    if (done) return;
    yield boardToPathEl(value, asyncDemoSize);
  }
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Hey

It works 🎉

Future ideas: 
* [x] symmetry
* [ ] nice rendering
* [ ] speed
  * don't find all mutations for each step, rather start on a random tile?
  * or a generator for mutations to only need to calculate the one we want?
  * more than 1 step per animation frame? 👈 would be easy but make it harder to see the growth.
* [ ] non-square tiles
* [ ] non-planar board
* [x] https://beta.observablehq.com/@tmcw/pauser to start animations once cell is in view
`
)})
    },
    {
      name: "pauser",
      value: (function(){return(
function* pauser(element) {
  // From https://beta.observablehq.com/@tmcw/pauser to make the animations below start on scroll
  yield element;
  // Just in case the element is too tall
  element.parentNode.style.maxHeight = '5vh'
  element.parentNode.style.overflow = 'auto'
  // Some browsers (Safari) don't support this feature yet, so fall back
  // to how this notebook would work without pauser doing its thing.
  if (!window.IntersectionObserver) return;
  yield new Promise(resolve => {
    let observer = (new window.IntersectionObserver(([entry]) => {
      entry.isIntersecting && (observer.disconnect(), resolve(element))
    }, { threshold: 0.9 }));
    observer.observe(element.parentNode)
  });
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Multiple paths in one board
This would not work with my last labyrith drawing code, which was built around one "linked-loop" path. Starting from tiles in this version, it's free.

Change the seed:
`
)})
    },
    {
      name: "viewof multipleDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "multipleDemoSeed",
      inputs: ["Generators","viewof multipleDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof multipleDemoW",
      inputs: ["html","width"],
      value: (function(html,width){return(
html`<input type="number" value="${Math.floor(width / 19 / 2) * 2 + 1}" min="3" max="101" step="1">`
)})
    },
    {
      name: "multipleDemoW",
      inputs: ["Generators","viewof multipleDemoW"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof multipleDemoH",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="17" min="3" max="101" step="1">`
)})
    },
    {
      name: "multipleDemoH",
      inputs: ["Generators","viewof multipleDemoH"],
      value: (G, _) => G.input(_)
    },
    {
      name: "makeMultipleStartBoard",
      inputs: ["makeInitialBoard"],
      value: (function(makeInitialBoard){return(
function (w, h) {
  const b = makeInitialBoard(w, h)
  b[0] = 1
  b[w - 1] = 1
  b[b.length - 1] = 1
  b[b.length - w] = 1
  return b;
}
)})
    },
    {
      inputs: ["makeMultipleStartBoard","multipleDemoW","multipleDemoH","pauser","boardToEl","solveAsync","multipleDemoSeed"],
      value: (async function*(makeMultipleStartBoard,multipleDemoW,multipleDemoH,pauser,boardToEl,solveAsync,multipleDemoSeed)
{
  let board = makeMultipleStartBoard(multipleDemoW, multipleDemoH)
  yield* pauser(boardToEl(board, multipleDemoW, multipleDemoH));
  const boardGen = solveAsync(multipleDemoSeed, board, multipleDemoW, multipleDemoH)
  while (true) {
    const {done, value} = await boardGen.next();
    if (done) return;
    yield boardToEl(value, multipleDemoW, multipleDemoH);
  }
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Outside in

Instead of a seed in the middle, start with a (double) path around the outside.
`
)})
    },
    {
      name: "makeInitialBoardPathAround",
      inputs: ["TILE_INDEX"],
      value: (function(TILE_INDEX){return(
function makeInitialBoardPathAround (w, h = w) {
  const length = w * h
  const board = [];
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      board[i] = TILE_INDEX.RB
    } else if (i === w - 1) {
      board[i] = TILE_INDEX.BL
    } else if (i === length - w) {
      board[i] = TILE_INDEX.TR
    } else if (i === length - 1) {
      board[i] = TILE_INDEX.TL
    } else if (i < w || i > length - w) {
      board[i] = TILE_INDEX.RL
    } else if (i % w === 0 || (i + 1) % w === 0){
      board[i] = TILE_INDEX.TB
    } else {
	  board[i] = 0
    }
  }
  return board
}
)})
    },
    {
      name: "viewof outDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "outDemoSeed",
      inputs: ["Generators","viewof outDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof outDemoSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="13" min="3" max="101" step="1">`
)})
    },
    {
      name: "outDemoSize",
      inputs: ["Generators","viewof outDemoSize"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["makeInitialBoardPathAround","outDemoSize","pauser","boardToPathEl","solveAsync","outDemoSeed"],
      value: (async function*(makeInitialBoardPathAround,outDemoSize,pauser,boardToPathEl,solveAsync,outDemoSeed)
{
  let board = makeInitialBoardPathAround(outDemoSize)
  yield* pauser(boardToPathEl(board, outDemoSize));
  const boardGen = solveAsync(outDemoSeed, board, outDemoSize)
  while (true) {
    const {done, value} = await boardGen.next();
    if (done) return;
    yield boardToPathEl(value, outDemoSize);
  }
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Negative space

By adding a tile type that isn't considered empty, the labyrinth will fill in around it.
`
)})
    },
    {
      name: "viewof negDemoWidth",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="11" min="3" max="101" step="1">`
)})
    },
    {
      name: "negDemoWidth",
      inputs: ["Generators","viewof negDemoWidth"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof negDemoHeight",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="9" min="3" max="101" step="1">`
)})
    },
    {
      name: "negDemoHeight",
      inputs: ["Generators","viewof negDemoHeight"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
* Click to toggle negative space
* Shift-click to toggle path starts
`
)})
    },
    {
      name: "viewof negSpace",
      inputs: ["negDemoWidth","negDemoHeight","TILE_INDEX","html"],
      value: (function(negDemoWidth,negDemoHeight,TILE_INDEX,html)
{
  const board = Array(negDemoWidth * negDemoHeight).fill(TILE_INDEX.EMPTY)
  board[0] = TILE_INDEX.O
  const middle = Math.floor(board.length / 2)
  board[middle] = TILE_INDEX.NEG
  board[middle - 1] = TILE_INDEX.NEG
  board[middle + 1] = TILE_INDEX.NEG
  board[middle - negDemoWidth] = TILE_INDEX.NEG
  board[middle + negDemoWidth] = TILE_INDEX.NEG
  
  function toString (board, width) {
    return board.map((t, i) => {
      let char = ''
      switch (t) {
        case TILE_INDEX.O:
          char = '🔘'
          break
        case TILE_INDEX.NEG: 
          char = '⬛️'
          break
        default: 
          char = '⬜️'
      }
      if (i > 0 && ((i + 1) % width) === 0) char += "\n"
      return char
    }).join('')
  }
  
  const el = html`<pre style="display: inline-block; font-size: 20px; line-height: 1; margin: 0; padding: 0; cursor: pointer;">${toString(board, negDemoWidth)}</pre>`
  
  el.onclick = (event) => {
    const {layerX, layerY, shiftKey} = event;
    const {width, height} = el.getBoundingClientRect();
    const row = Math.floor(layerY / height * negDemoHeight)
    const col = Math.floor((layerX - 10) / width * negDemoWidth)
    const index = row * negDemoWidth + col
    if (board[index] === undefined) return
    if (shiftKey) {
      board[index] = board[index] === TILE_INDEX.O ? TILE_INDEX.EMPTY : TILE_INDEX.O
    } else {
      board[index] = board[index] === TILE_INDEX.NEG ? TILE_INDEX.EMPTY : TILE_INDEX.NEG
    }

    el.textContent = toString(board, negDemoWidth)
	
    // make it viewof-able?
    el.value = board
    el.dispatchEvent(new CustomEvent('input'))
  }

  // make it viewof-able?
  el.value = board
  el.dispatchEvent(new CustomEvent('input'))

  return el;
}
)
    },
    {
      name: "negSpace",
      inputs: ["Generators","viewof negSpace"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof negDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "negDemoSeed",
      inputs: ["Generators","viewof negDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["boardToPathEl","solveSync","negDemoSeed","negSpace","negDemoWidth","negDemoHeight"],
      value: (function(boardToPathEl,solveSync,negDemoSeed,negSpace,negDemoWidth,negDemoHeight){return(
boardToPathEl(solveSync(negDemoSeed, negSpace.slice(), negDemoWidth, negDemoHeight), negDemoWidth, negDemoHeight)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Rotational symmetry

It should be pretty easy to add symmetry to each step. I'll add a column to the \`TILES\` dictionary to define each tile rotated 180°. (I thought about extending \`TILES\` at this point in the doc, which would feel better in the literary flow, but I think it would be harder to write. Tradeoffs.)

Width should be odd for these.`
)})
    },
    {
      name: "solveSymmetrical",
      inputs: ["makeRandomGenerator","findMutations","TILE_INDEX","TILES","ROTATED","UNDER","LEFT","OVER","RIGHT"],
      value: (function(makeRandomGenerator,findMutations,TILE_INDEX,TILES,ROTATED,UNDER,LEFT,OVER,RIGHT){return(
function solveSymmetrical (seed, board, w, h = w) {
  // if (w % 2 === 0) {
  //   throw "w should be odd"
  // }
  // if (h % 2 === 0) {
  //   throw "h should be odd"
  // }
  const random = makeRandomGenerator(seed)
  const len = board.length
  let mutations = findMutations(board, w)
  let i = 0
  while (mutations.length) {
    const mutation = mutations[random(mutations.length)]
    const [thisIndex, thisTile, thatIndex, thatTile] = mutation;
    board[thisIndex] = thisTile
    board[thatIndex] = thatTile
    
    // Symmetry
    if (board[len - 1 - thisIndex] === TILE_INDEX.EMPTY) {
      const addTileIndex = TILE_INDEX[TILES[thisTile][ROTATED]]
      board[len - 1 - thisIndex] = addTileIndex
      const extendTile = TILES[board[len - 1 - thatIndex]]
      switch (addTileIndex) {
        case TILE_INDEX.T:
          board[len - 1 - thatIndex] = TILE_INDEX[extendTile[UNDER]]
          break
        case TILE_INDEX.R:
          board[len - 1 - thatIndex] = TILE_INDEX[extendTile[LEFT]]
          break
        case TILE_INDEX.B:
          board[len - 1 - thatIndex] = TILE_INDEX[extendTile[OVER]]
          break
        case TILE_INDEX.L:
          board[len - 1 - thatIndex] = TILE_INDEX[extendTile[RIGHT]]
          break
        default:
          break
      }
    }
    
    mutations = findMutations(board, w)
    i++
  }
  return board
}
)})
    },
    {
      name: "viewof symDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "symDemoSeed",
      inputs: ["Generators","viewof symDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof symDemoSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="9" min="5" max="101" step="2">`
)})
    },
    {
      name: "symDemoSize",
      inputs: ["Generators","viewof symDemoSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "symmetricalEl",
      inputs: ["boardToPathEl","solveSymmetrical","symDemoSeed","makeInitialBoard","symDemoSize"],
      value: (function(boardToPathEl,solveSymmetrical,symDemoSeed,makeInitialBoard,symDemoSize){return(
boardToPathEl(solveSymmetrical(symDemoSeed, makeInitialBoard(symDemoSize), symDemoSize), symDemoSize)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`# WIP... Moving through dimensions

I think there is something to find exploring the WaveFormCollapse into other dimensions, for different kinds of animation other than just growing. Each step in the animation is choosing one of the possibilities, collapsing potential realities down to one.

Let's look at a solved labyrinth. If we make the "other" choice in the last collapse, one of the "end bends" will blip out and be replaced with one from another direction.
`
)})
    },
    {
      inputs: ["boardToPathEl","solveSyncStep","wfcDemoSeed","makeInitialBoard"],
      value: (function(boardToPathEl,solveSyncStep,wfcDemoSeed,makeInitialBoard){return(
boardToPathEl(solveSyncStep(wfcDemoSeed, makeInitialBoard(3), 9, 3), 3)
)})
    },
    {
      inputs: ["boardToPathEl","solveSyncStep","wfcDemoSeed","makeInitialBoard"],
      value: (function(boardToPathEl,solveSyncStep,wfcDemoSeed,makeInitialBoard){return(
  boardToPathEl(solveSyncStep(wfcDemoSeed, makeInitialBoard(3), 9 - 2, 3), 3)

)})
    },
    {
      name: "solveSyncStep",
      inputs: ["makeRandomGenerator","findMutations"],
      value: (function(makeRandomGenerator,findMutations){return(
function solveSyncStep (seed, board, entropyStep, w, h = w) {
  const random = makeRandomGenerator(seed)
  let mutations = findMutations(board, w)
  let i = 0
  while (mutations.length) {
    let mutationIndex = random(mutations.length)
    if (i === entropyStep) {
      mutationIndex = (mutationIndex + Math.floor(mutations.length / 2)) % mutations.length
    }
    const mutation = mutations[mutationIndex]
    board[mutation[0]] = mutation[1]
    board[mutation[2]] = mutation[3]
    mutations = findMutations(board, w)
    i++
  }
  return board
}
)})
    },
    {
      name: "viewof wfcDemoSeed",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="text" value="hello">`
)})
    },
    {
      name: "wfcDemoSeed",
      inputs: ["Generators","viewof wfcDemoSeed"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof wfcDemoSize",
      inputs: ["html"],
      value: (function(html){return(
html`<input type="number" value="7" min="3" max="101" step="2">`
)})
    },
    {
      name: "wfcDemoSize",
      inputs: ["Generators","viewof wfcDemoSize"],
      value: (G, _) => G.input(_)
    },
    {
      name: "wfcSteps",
      inputs: ["wfcDemoSize"],
      value: (function(wfcDemoSize){return(
wfcDemoSize * wfcDemoSize
)})
    },
    {
      name: "viewof wfcEntropyStep",
      inputs: ["html","wfcSteps"],
      value: (function(html,wfcSteps){return(
html`<input type="range" value="${wfcSteps}" min="0" max="${wfcSteps}" step="1">`
)})
    },
    {
      name: "wfcEntropyStep",
      inputs: ["Generators","viewof wfcEntropyStep"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["boardToPathEl","solveSyncStep","wfcDemoSeed","makeInitialBoard","wfcDemoSize","wfcEntropyStep"],
      value: (function(boardToPathEl,solveSyncStep,wfcDemoSeed,makeInitialBoard,wfcDemoSize,wfcEntropyStep){return(
boardToPathEl(solveSyncStep(wfcDemoSeed, makeInitialBoard(wfcDemoSize), wfcEntropyStep, wfcDemoSize), wfcDemoSize)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`But then going back from there, chosing different ones... how will that shift the form? Can we find a path through that space back to the original form to find an interesting loop?`
)})
    }
  ]
};

const m1 = {
  id: "@forresto/random-seed",
  variables: [
    {
      name: "makeRandomGenerator",
      inputs: ["uheprng"],
      value: (function(uheprng){return(
(seed) => uheprng(seed)
)})
    },
    {
      name: "uheprng",
      inputs: ["Mash"],
      value: (function(Mash){return(
function (seed) {
	return (function () {
		var o = 48; // set the 'order' number of ENTROPY-holding 32-bit values
		var c = 1; // init the 'carry' used by the multiply-with-carry (MWC) algorithm
		var p = o; // init the 'phase' (max-1) of the intermediate variable pointer
		var s = new Array(o); // declare our intermediate variables array
		var i; // general purpose local
		var j; // general purpose local
		var k = 0; // general purpose local

		// when our "uheprng" is initially invoked our PRNG state is initialized from the
		// browser's own local PRNG. This is okay since although its generator might not
		// be wonderful, it's useful for establishing large startup entropy for our usage.
		var mash = new Mash(); // get a pointer to our high-performance "Mash" hash

		// fill the array with initial mash hash values
		for (i = 0; i < o; i++) {
			s[i] = mash(Math.random());
		}

		// this PRIVATE (internal access only) function is the heart of the multiply-with-carry
		// (MWC) PRNG algorithm. When called it returns a pseudo-random number in the form of a
		// 32-bit JavaScript fraction (0.0 to <1.0) it is a PRIVATE function used by the default
		// [0-1] return function, and by the random 'string(n)' function which returns 'n'
		// characters from 33 to 126.
		var rawprng = function () {
			if (++p >= o) {
				p = 0;
			}
			var t = 1768863 * s[p] + c * 2.3283064365386963e-10; // 2^-32
			return s[p] = t - (c = t | 0);
		};

		// this EXPORTED function is the default function returned by this library.
		// The values returned are integers in the range from 0 to range-1. We first
		// obtain two 32-bit fractions (from rawprng) to synthesize a single high
		// resolution 53-bit prng (0 to <1), then we multiply this by the caller's
		// "range" param and take the "floor" to return a equally probable integer.
		var random = function (range) {
			return Math.floor(range * (rawprng() + (rawprng() * 0x200000 | 0) * 1.1102230246251565e-16)); // 2^-53
		};

		// this EXPORTED function 'string(n)' returns a pseudo-random string of
		// 'n' printable characters ranging from chr(33) to chr(126) inclusive.
		random.string = function (count) {
			var i;
			var s = '';
			for (i = 0; i < count; i++) {
				s += String.fromCharCode(33 + random(94));
			}
			return s;
		};

		// this PRIVATE "hash" function is used to evolve the generator's internal
		// entropy state. It is also called by the EXPORTED addEntropy() function
		// which is used to pour entropy into the PRNG.
		var hash = function () {
			var args = Array.prototype.slice.call(arguments);
			for (i = 0; i < args.length; i++) {
				for (j = 0; j < o; j++) {
					s[j] -= mash(args[i]);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED "clean string" function removes leading and trailing spaces and non-printing
		// control characters, including any embedded carriage-return (CR) and line-feed (LF) characters,
		// from any string it is handed. this is also used by the 'hashstring' function (below) to help
		// users always obtain the same EFFECTIVE uheprng seeding key.
		random.cleanString = function (inStr) {
			inStr = inStr.replace(/(^\s*)|(\s*$)/gi, ''); // remove any/all leading spaces
			inStr = inStr.replace(/[\x00-\x1F]/gi, ''); // remove any/all control characters
			inStr = inStr.replace(/\n /, '\n'); // remove any/all trailing spaces
			return inStr; // return the cleaned up result
		};

		// this EXPORTED "hash string" function hashes the provided character string after first removing
		// any leading or trailing spaces and ignoring any embedded carriage returns (CR) or Line Feeds (LF)
		random.hashString = function (inStr) {
			inStr = random.cleanString(inStr);
			mash(inStr); // use the string to evolve the 'mash' state
			for (i = 0; i < inStr.length; i++) { // scan through the characters in our string
				k = inStr.charCodeAt(i); // get the character code at the location
				for (j = 0; j < o; j++) { //	"mash" it into the UHEPRNG state
					s[j] -= mash(k);
					if (s[j] < 0) {
						s[j] += 1;
					}
				}
			}
		};

		// this EXPORTED function allows you to seed the random generator.
		random.seed = function (seed) {
			if (typeof seed === 'undefined' || seed === null) {
				seed = Math.random().toString();
			}
			if (typeof seed !== 'string') {
              	throw new Error('seed should be a string')
			}
			random.initState();
			random.hashString(seed);
		};

		// this handy exported function is used to add entropy to our uheprng at any time
		random.addEntropy = function ( /* accept zero or more arguments */ ) {
			var args = [];
			for (i = 0; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			hash((k++) + (new Date().getTime()) + args.join('') + Math.random());
		};

		// if we want to provide a deterministic startup context for our PRNG,
		// but without directly setting the internal state variables, this allows
		// us to initialize the mash hash and PRNG's internal state before providing
		// some hashing input
		random.initState = function () {
			mash(); // pass a null arg to force mash hash to init
			for (i = 0; i < o; i++) {
				s[i] = mash(' '); // fill the array with initial mash hash values
			}
			c = 1; // init our multiply-with-carry carry
			p = o; // init our phase
		};

		// we use this (optional) exported function to signal the JavaScript interpreter
		// that we're finished using the "Mash" hash function so that it can free up the
		// local "instance variables" is will have been maintaining.  It's not strictly
		// necessary, of course, but it's good JavaScript citizenship.
		random.done = function () {
			mash = null;
		};

		// if we called "uheprng" with a seed value, then execute random.seed() before returning
		if (typeof seed !== 'undefined') {
			random.seed(seed);
		}

		// Returns a random integer between 0 (inclusive) and range (exclusive)
		random.range = function (range) {
			return random(range);
		};

		// Returns a random float between 0 (inclusive) and 1 (exclusive)
		random.random = function () {
			return random(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
		};

		// Returns a random float between min (inclusive) and max (exclusive)
		random.floatBetween = function (min, max) {
			return random.random() * (max - min) + min;
		};

		// Returns a random integer between min (inclusive) and max (inclusive)
		random.intBetween = function (min, max) {
			return Math.floor(random.random() * (max - min + 1)) + min;
		};

		// when our main outer "uheprng" function is called, after setting up our
		// initial variables and entropic state, we return an "instance pointer"
		// to the internal anonymous function which can then be used to access
		// the uheprng's various exported functions.  As with the ".done" function
		// above, we should set the returned value to 'null' once we're finished
		// using any of these functions.
		return random;
	}());
}
)})
    },
    {
      name: "Mash",
      value: (function(){return(
function () {
	var n = 0xefc8249d;
	var mash = function (data) {
		if (data) {
			data = data.toString();
			for (var i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				var h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
		} else {
			n = 0xefc8249d;
		}
	};
	return mash;
}
)})
    }
  ]
};

const notebook = {
  id: "6b688f41041a357a@1790",
  modules: [m0,m1]
};

export default notebook;
