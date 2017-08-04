/// <reference path="node_modules/makerjs/index.d.ts" />

import * as MakerJs from 'makerjs';

/*

← ← ↑ → → ↑ → ↑ ↑ → ↓ ↓ → → ↓ ← ← ↓ ← ↓ ↓ ← ↑ ↑

. . . → ↓ . . 
. . . ↑ ↓ . . 
. . → ↑ → → ↓ 
→ → ↑ . ↓ ← ← 
↑ ← ← ↓ ← . . 
. . ↑ ↓ . . . 
. . ↑ ← . . . 

*/

const SIZE = 7;
const MAX = Math.floor(SIZE / 2);
const MIN = -1 * MAX;
const SCALE = 72;
const RADIUS = 24;
const STROKE = 12;
const symmetry = true;
const DEBUG = true;

type Point = [number, number];

const LEFT: Point = [-1, 0];
const RIGHT: Point = [1, 0];
const UP: Point = [0, -1];
const DOWN: Point = [0, 1];

const enum Direction {
  Up,
  Down,
  Left,
  Right
}

type Path = Array<Direction>;

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

const start: Point = [Math.floor(SIZE / 2) - 1, Math.floor(SIZE / 2) + 1];
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

function makeBoard(size, path: Path, start) {
  let board = [];
  let length = size * size;
  for (let i = 0; i < length; i++) {
    board[i] = null;
  }
  let x = start[X];
  let y = start[Y];
  return path.reduce(function(board, current, index, array) {
    board[y * size + x] = current;
    x += DIR[current][X];
    y += DIR[current][Y];
    return board;
  }, board);
}

function boardToString(board, size) {
  return board.reduce(function(output, current, index, board) {
    let char = '. ';
    if (current != null) {
      char = PRINT[current] + ' ';
    }
    if (index > 0 && (index + 1) % SIZE === 0) {
      char += '\n';
    }
    return output + char;
  }, '');
}

const initialBoard = makeBoard(SIZE, initial, start);
console.log(initialBoard);
console.log(boardToString(initialBoard, SIZE));

// function Make

type Mutation = [number, Direction];
type Mutations = Array<Mutation>;

const mutations: Mutations = [
  [0, Direction.Left],
  [1, Direction.Left],
  [7, Direction.Up],
  [8, Direction.Up]
];

function makePath(directions: Path, mutations: Mutations) {
  const directionsBumped: Path = mutations.reduce(function(
    last,
    current,
    mutationIndex,
    array
  ) {
    const [index, direction] = current;
    last.splice(index, 0, direction);
    const opposite = Opposite[direction];
    last.splice((index + 2) % last.length, 0, opposite);
    if (symmetry) {
      const len = last.length;
      const symIndex = (index + Math.floor(len / 2) + 1) % (len + 1);
      console.log(symIndex);
      last.splice(symIndex, 0, opposite);
      const symIndex2 = (symIndex + 2) % (last.length + 1);
      console.log(symIndex2);
      last.splice(symIndex2, 0, direction);
    }
    if (DEBUG) {
      // console.log(last);
      console.log(last.map(i => PRINT[i]).join(' '));
      console.log(boardToString(makeBoard(SIZE, last, start), SIZE));
    }
    return last;
  }, directions.slice());

  let x = start[X];
  let y = start[Y];

  const path = directionsBumped.map(function(direction) {
    const absolutePoint: Point = [x, y];
    x += DIR[direction][X];
    y += DIR[direction][Y];
    return absolutePoint;
  });

  return path;
}

const laby = makePath(initial, mutations);
console.log(laby);

function pathToMaker(path): MakerJs.IModel {
  const length = path.length;

  const lines = path.reduce(function(last, current, index, array) {
    const line = new MakerJs.paths.Line(current, array[(index + 1) % length]);
    const scaled = MakerJs.path.scale(line, SCALE);
    last['line' + index] = scaled;
    return last;
  }, {});

  const fillets = path.reduce(function(last, current, index, array) {
    const fillet = MakerJs.path.fillet(
      lines['line' + index],
      lines['line' + (index + 1) % length],
      RADIUS
    );
    if (fillet) {
      last['fillet' + index] = fillet;
    } else {
      console.warn("Couldn't fillet", index);
    }
    return last;
  }, {});

  const paths = {...lines, ...fillets};
  // Mirror Y to normalize coordinate system
  const mirrored = MakerJs.model.mirror({paths}, false, true);
  return mirrored;
}

const makerPath = pathToMaker(laby);
const expanded = MakerJs.model.expandPaths(makerPath, STROKE);

const cut = {
  paths: makerPath.paths,
  models: {
    expanded
  }
};

console.log(cut);
const svg = MakerJs.exporter.toSVG(cut);
document.write(svg);
