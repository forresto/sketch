/// <reference path="node_modules/@types/maker.js/index.d.ts" />

/*

* * * R-D * *
* * * U D * *
* * R-U R-R-D
R-R-U * D-L-L
U-L-L D-D * *
* * U D * * *
* * U-L * * *

*/


const makerjs = require('makerjs');

const SIZE = 10;
const MAX = Math.floor(SIZE / 2);
const MIN = -1 * MAX;
const SCALE = 72;
const RADIUS = 24;
const STROKE = 12;
const symmetry = true;

type Point = [number, number];
type Path = Array<Point>;
type Model = {paths?: any; models?: any};

const L: Point = [-1, 0];
const R: Point = [1, 0];
const U: Point = [0, 1];
const D: Point = [0, -1];

const start: Point = [Math.floor(SIZE / 2), Math.floor(SIZE / 2)];

const initial: Path = [U, U, R, R, D, D, L, L];

type Mutation = [number, Point];
type Mutations = Array<Mutation>;

const mutations: Mutations = [[0, L], [1, L], [7, U], [9, U]];

function makePath(directions: Path, mutations: Mutations): Path {
  const directionsBumped: Path = mutations.reduce(function(
    last,
    current,
    mutationIndex,
    array
  ) {
    const [index, direction] = current;
    last.splice(index, 0, direction);
    const opposite: Point = [0 - direction[0], 0 - direction[1]];
    last.splice((index + 2) % last.length, 0, opposite);
    if (symmetry) {
      const len = last.length;
      const index2 = (index + 1 + Math.floor(len / 2)) % len;
      last.splice(index2, 0, opposite);
      last.splice((index2 + 2) % last.length, 0, direction);
    }
    return last;
  }, directions.slice());

  let x = start[0];
  let y = start[1];

  const path: Path = directionsBumped.map(function(direction) {
    x += direction[0];
    y += direction[1];
    const absolutePoint: Point = [x, y];
    return absolutePoint;
  });

  return path;
}

const laby = makePath(initial, mutations);

function pathToMaker(path: Path): Model {
  const length = path.length;

  const lines = path.reduce(function(last, current, index, array) {
    const line = new makerjs.paths.Line(current, array[(index + 1) % length]);
    const scaled = makerjs.path.scale(line, SCALE);
    last['line' + index] = scaled;
    return last;
  }, {});

  const fillets = path.reduce(function(last, current, index, array) {
    const fillet = makerjs.path.fillet(
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
  return {paths};
}

const makerPath = pathToMaker(laby);
const expanded = makerjs.model.expandPaths(makerPath, STROKE);

const cut = {
  paths: makerPath.paths,
  models: {
    expanded
  }
};

console.log(cut);
const svg = makerjs.exporter.toSVG(cut);
document.write(svg);
