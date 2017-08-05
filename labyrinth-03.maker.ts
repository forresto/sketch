/// <reference path="node_modules/makerjs/index.d.ts" />

/*

↑ ↑ ← ↓ ↓ ↓ ↓ ↓ ← ↑ ↑ ↑ ← ↓ ↓ ↓ ← ↑ ↑ ↑ ← ↓ ↓ ↓ ← ↑ ↑ ↑ ↑ → ↑ ← ↑ → ↑ ↑ ← ↑ → → ↓ ↓ ↓ ↓ ↓ → → ↑ ← ↑ → ↑ → ↓ → ↑ ↑ ← ← ← ↑ ↑ ← ← ← ↑ → → → → ↓ ↓ → ↑ ↑ → ↓ ↓ → ↑ → ↑ → ↓ → → ↑ → ↓ → ↑ → ↓ ↓ ← ← ← ← ← ← ↓ ← ↓ → ↓ ← ↓ → ↓ ↓ → ↑ ↑ ↑ ↑ ↑ → ↓ ↓ ↓ → ↑ ↑ ↑ → ↓ ↓ ↓ → ↑ ↑ ↑ → ↓ ↓ ↓ ↓ ← ↓ → ↓ ← ↓ ↓ → ↓ ← ← ↑ ↑ ↑ ↑ ↑ ← ← ↓ → ↓ ← ↓ ← ↑ ← ↓ ↓ → → → ↓ ↓ → → → ↓ ← ← ← ← ↑ ↑ ← ↓ ↓ ← ↑ ↑ ← ↓ ← ↓ ← ↑ ← ← ↓ ← ↑ ← ↓ ← ↑ ↑ → → → → → → ↑ → ↑ ← ↑ → ↑ ←

→ → → → ↓ → ↓ . → ↓ . → ↓ → ↓ 
↑ ← ← ← ↓ ↑ ↓ → ↑ → → ↑ → ↑ ↓ 
→ → ↓ ↑ → ↑ → ↑ ↓ ← ← ← ← ← ← 
↑ ← ↓ ↑ ← ← ← ↓ ← → ↓ → ↓ → ↓ 
. ↑ ↓ . → ↓ ↑ → ↓ ↑ ↓ ↑ ↓ ↑ ↓ 
→ ↑ ↓ → ↑ → ↑ ↓ ← ↑ ↓ ↑ ↓ ↑ ↓ 
↑ ← ↓ ↑ ← ↓ ← → ↓ ↑ → ↑ → ↑ ↓ 
→ ↑ → → ↑ ↓ ↑ . ↓ ↑ ↓ ← ← ↓ ← 
↑ ↓ ← ↓ ← ↓ ↑ ← → ↑ → ↓ ↑ → ↓ 
↑ ↓ ↑ ↓ ↑ ↓ → ↑ ↓ ← ↓ ← ↑ ↓ ← 
↑ ↓ ↑ ↓ ↑ ↓ ↑ ← ↓ ↑ ← . ↑ ↓ . 
↑ ← ↑ ← ↑ ← → ↑ → → → ↓ ↑ → ↓ 
→ → → → → → ↑ ↓ ← ↓ ← ↓ ↑ ← ← 
↑ ↓ ← ↓ ← ← ↓ ← ↑ ↓ ↑ → → → ↓ 
↑ ← ↑ ← . ↑ ← . ↑ ← ↑ ← ← ← ← 

*/

import * as MakerJs from 'makerjs';

type Point = [number, number];
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

type Path = Array<Direction>;
type AbsPath = Array<Point>;

type BoardSpace = {
  direction: Direction;
  point: Point;
  index: number;
  next: number;
} | null;
type Board = Array<BoardSpace>;

type Mutation = [number, Direction];
type Mutations = Array<Mutation>;

const SIZE = 15;
const MAX = Math.floor(SIZE / 2);
const MIN = -1 * MAX;
const SCALE = 48;
const BOARD = (SIZE + 1) * SCALE;
const RADIUS = 18;
const STROKE = 36;
const SYMMETRY = true;
const DEBUG = true;
const THICKNESS = 2;
const DEPTH = STROKE / 2;
const PAGES = DEPTH / THICKNESS;

const LEFT: Point = [-1, 0];
const RIGHT: Point = [1, 0];
const UP: Point = [0, -1];
const DOWN: Point = [0, 1];

const DIR = [UP, DOWN, LEFT, RIGHT];
const Opposite = [
  Direction.Down,
  Direction.Up,
  Direction.Right,
  Direction.Left
];
// const OPP = [DOWN, UP, RIGHT, LEFT];
const PRINT = ['↑', '↓', '←', '→'];

const X = 0;
const Y = 1;

const START: Point = [Math.floor(SIZE / 2) - 1, Math.floor(SIZE / 2) + 1];
const initial: Path = [
  Direction.Up,
  Direction.Up,
  Direction.Right,
  Direction.Right,
  Direction.Down,
  Direction.Down,
  Direction.Left,
  Direction.Left
];

function makeBoard(
  path: Path,
  start: Point = START,
  size: number = SIZE
): Board {
  let board = [];
  let length = size * size;
  for (let i = 0; i < length; i++) {
    board[i] = null;
  }
  let x = start[X];
  let y = start[Y];
  return path.reduce(function(board, direction, index, path) {
    const next = (index + 1) % path.length;
    board[y * size + x] = {direction, point: [x, y], index, next};
    x += DIR[direction][X];
    y += DIR[direction][Y];
    return board;
  }, board);
}

function getBoardSpace(
  board: Board,
  x: number,
  y: number,
  size: number = SIZE
): BoardSpace {
  const index = y * size + x;
  return board[index];
}

function boardToString(board, size: number = SIZE) {
  return board.reduce(function(output, current, index, board) {
    let char = '. ';
    if (current != null) {
      char = PRINT[current.direction] + ' ';
    }
    if (index > 0 && (index + 1) % SIZE === 0) {
      char += '\n';
    }
    return output + char;
  }, '');
}

// const mutations: Mutations = [
//   [0, Direction.Left],
//   [1, Direction.Left],
//   [7, Direction.Up],
//   [8, Direction.Up]
// ];

function pathWithMutations(path: Path, mutations: Mutations): Path {
  return mutations.reduce(function(
    last: Path,
    current: Mutation,
    mutationIndex: number,
    array: Mutations
  ) {
    const [index, direction] = current;
    last.splice(index, 0, direction);
    const opposite = Opposite[direction];
    const index2 = (index + 2) % (last.length + 1);
    last.splice(index2, 0, opposite);
    if (SYMMETRY) {
      // TODO wrap bugs
      const len = last.length;
      let symIndex = (index + len / 2 + 1) % len;
      if (symIndex === 0) {
        symIndex = len;
      }
      last.splice(symIndex, 0, opposite);
      let symIndex2 = (symIndex + 2) % last.length;
      if (symIndex2 === 0) {
        symIndex2 = last.length;
      }
      last.splice(symIndex2, 0, direction);
    }
    return last;
  }, path.slice());
}

function makeAbsPath(path: Path, start: Point = START): AbsPath {
  let x = start[X];
  let y = start[Y];

  return path.map(function(direction) {
    const absolutePoint: Point = [x, y];
    x += DIR[direction][X];
    y += DIR[direction][Y];
    return absolutePoint;
  });
}

function getPossibleMutations(path: Path, size: number = SIZE): Mutations {
  const board = makeBoard(path);
  return board.reduce(function(
    possible: Mutations,
    boardSpace: BoardSpace,
    boardIndex,
    board
  ) {
    if (!boardSpace) return possible;
    const {direction, point, index, next} = boardSpace;
    const nextDirection = path[next];
    const [x, y] = point;
    switch (direction) {
      case Direction.Up:
        if (
          (nextDirection === Direction.Up ||
            nextDirection === Direction.Right) &&
          x > 0 &&
          y > 0
        ) {
          const bump1 = getBoardSpace(board, x - 1, y);
          const bump2 = getBoardSpace(board, x - 1, y - 1);
          if (!bump1 && !bump2) {
            possible.push([index, Direction.Left]);
          }
        }
        break;
      case Direction.Down:
        if (
          (nextDirection === Direction.Down ||
            nextDirection === Direction.Left) &&
          x < size - 1 &&
          y < size - 1
        ) {
          const bump1 = getBoardSpace(board, x + 1, y);
          const bump2 = getBoardSpace(board, x + 1, y + 1);
          if (!bump1 && !bump2) {
            possible.push([index, Direction.Right]);
          }
        }
        break;
      case Direction.Left:
        if (
          (nextDirection === Direction.Left ||
            nextDirection === Direction.Up) &&
          x > 0 &&
          y < size - 1
        ) {
          const bump1 = getBoardSpace(board, x, y + 1);
          const bump2 = getBoardSpace(board, x - 1, y + 1);
          if (!bump1 && !bump2) {
            possible.push([index, Direction.Down]);
          }
        }
        break;
      case Direction.Right:
        if (
          (nextDirection === Direction.Right ||
            nextDirection === Direction.Down) &&
          x < size - 1 &&
          y > 0
        ) {
          const bump1 = getBoardSpace(board, x, y - 1);
          const bump2 = getBoardSpace(board, x + 1, y - 1);
          if (!bump1 && !bump2) {
            possible.push([index, Direction.Up]);
          }
        }
        break;
      default:
        break;
    }
    return possible;
  }, []);
}

function logPath(path) {
  console.log(path.map(i => PRINT[i]).join(' '));
  console.log(boardToString(makeBoard(path)));
}

function randomMutations(path: Path): Mutations {
  const mutations = [];
  if (DEBUG) {
    logPath(path);
  }
  let possible = getPossibleMutations(path);
  while (possible.length > 0) {
    const mutation = possible[Math.floor(Math.random() * possible.length)];
    mutations.push(mutation);
    const currentPath = pathWithMutations(path, mutations);
    if (DEBUG) {
      logPath(currentPath);
    }
    possible = getPossibleMutations(currentPath);
    if (mutations.length > SIZE * SIZE) {
      console.error('oops');
      return;
    }
  }
  return mutations;
}

const mutations = randomMutations(initial);
const laby = makeAbsPath(pathWithMutations(initial, mutations));
// console.log(laby);

function pathToMaker(path: AbsPath): MakerJs.IModel {
  const length = path.length;

  const lines = path.reduce(function(last, current, index, array) {
    const line = new MakerJs.paths.Line(current, array[(index + 1) % length]);
    const scaled = MakerJs.path.scale(line, SCALE);
    last['line' + index] = scaled;
    return last;
  }, {});

  const output: MakerJs.IModel = {paths: lines};

  MakerJs.model.findChains(output, function(chains, loose, layer) {
    const chain = chains[0];
    const fillets = MakerJs.chain.fillet(chain, RADIUS);
    output.models = {fillets};
  });
  // MakerJs.model.move(output, [SCALE / 2, SCALE / 2]);

  // Mirror Y to normalize coordinate system
  // const mirrored = MakerJs.model.mirror(output, false, true);
  // mirrored.units = MakerJs.unitType.Millimeter;
  // MakerJs.model.move(mirrored, [0, 0 - BOARD]);
  return output;
}

const makerPath = pathToMaker(laby);

function simpleExpand(model, stroke = STROKE): MakerJs.IModel {
  const paths = {};
  const lines = model.paths;
  const stroke2 = stroke / 2;
  for (let key in lines) {
    if (lines.hasOwnProperty(key)) {
      let line: MakerJs.paths.Line = lines[key];
      if (line.end[X] === line.origin[X]) {
        // Vertical line segment
        paths[key + 'L'] = MakerJs.path.moveRelative(
          MakerJs.cloneObject(line),
          [-stroke2, 0]
        );
        paths[key + 'R'] = MakerJs.path.moveRelative(
          MakerJs.cloneObject(line),
          [stroke2, 0]
        );
      } else {
        // Horizontal line segment
        paths[key + 'U'] = MakerJs.path.moveRelative(
          MakerJs.cloneObject(line),
          [0, stroke2]
        );
        paths[key + 'D'] = MakerJs.path.moveRelative(
          MakerJs.cloneObject(line),
          [0, -stroke2]
        );
      }
    }
  }
  const fillets = model.models.fillets.paths;
  for (let key in fillets) {
    if (fillets.hasOwnProperty(key)) {
      let fillet = fillets[key];
      paths[key + 'In'] = {...fillet, radius: fillet.radius - stroke2};
      paths[key + 'Out'] = {...fillet, radius: fillet.radius + stroke2};
    }
  }
  return {paths};
}

// const expanded = MakerJs.model.expandPaths(makerPath, STROKE);

const points = [
  [0, 0],
  [0, BOARD - SCALE],
  [BOARD - SCALE, 0],
  [BOARD - SCALE, BOARD - SCALE],
  [(BOARD - SCALE) / 2, (BOARD - SCALE) / 2]
  // [-SCALE / 2, SCALE / 2],
  // [BOARD - SCALE * 3/2, SCALE / 2],
  // [-SCALE/2, -BOARD + SCALE * 3/2],
  // [BOARD - SCALE * 3/2, -BOARD + SCALE * 3/2],
];
const holes: MakerJs.IModel = new MakerJs.models.Holes(2, points);
MakerJs.model.move(holes, [0 - SCALE / 2, 0 - SCALE / 2]);

/* 

  The Stack To Cut

  stacked paper with approx semicircular path

*/

const expanded = {};
const layerOptions = {};
const MARGIN = 12;
const COLS = 3;
for (let i = 0; i < PAGES; i++) {
  const depth = THICKNESS * (PAGES - i - 1);
  // Length of chord, like Pythagoras
  const stroke = 2 * Math.sqrt(DEPTH * DEPTH - depth * depth);
  console.log(i, depth, stroke);
  const name = 'expanded' + i;
  const layer = simpleExpand(makerPath, stroke);
  // MakerJs.model.moveRelative(layer, [SCALE, -BOARD])
  const border = MakerJs.model.move(
    new MakerJs.models.RoundRectangle(BOARD, BOARD, RADIUS),
    [0 - SCALE, 0 - SCALE]
  );
  layer.models = {border, holes};
  layer.layer = name;
  // layerOptions[name] = {fill: `hsla(${360 / PAGES * i}, 100%, 50%, 1)`};
  // layerOptions[name] = {fill: i%2===0 ? 'grey' : 'black'};
  const x = i % COLS * (BOARD + MARGIN);
  const y = Math.floor(i / COLS) * (BOARD + MARGIN);
  MakerJs.model.move(layer, [x, -y]);
  expanded[name] = layer;
}

const cut = {
  models: {
    // line: makerPath,
    expanded: {models: expanded}
  }
};

console.log(cut);
const svg = MakerJs.exporter.toSVG(cut, {
  // useSvgPathOnly: !DEBUG,
  // annotate: DEBUG,
  fill: 'white',
  // stroke: 'none',
  layerOptions
});
document.write(svg);

document.body.style.backgroundColor = 'hsla(0, 0%, 90%, 1)';
