(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var labyrinth_1 = require("./labyrinth");
var RandomSeed = require('random-seed');
// function seededDrawingParams(seed: string, lineWidthMax: number) {
//   const Seeded = RandomSeed.create(seed);
//   const lineWidthMin = 2;
//   const halfSpace = Math.floor((lineWidthMax + 2) / 2)
//   const lineWidth = [
//     lineWidthMin,
//     halfSpace,
//     lineWidthMax,
//     Seeded.intBetween(lineWidthMin, lineWidthMax),
//   ][Seeded.intBetween(0, 3)];
//   // const lineWidth = Seeded.intBetween(lineWidthMin, lineWidthMax);
//   const lineJoin = ['bevel', 'round', 'miter'][Seeded.intBetween(0, 2)];
//   return {lineWidth, lineJoin};
// }
function labyrinthToCanvas(labyrinth, grid, seed) {
    var canvas = document.createElement('canvas');
    var size = 1500;
    canvas.width = canvas.height = size;
    var context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, size, size);
    context.strokeStyle = '#FFF';
    var space = Math.floor(size / (grid + 1));
    var lineWidthMax = space - 4;
    // const {lineWidth, lineJoin} = seededDrawingParams(seed, lineWidthMax);
    // context.lineWidth = lineWidth;
    // context.lineJoin = lineJoin;
    var lineWidth = lineWidthMax;
    context.lineWidth = lineWidth;
    context.lineJoin = 'round';
    var pixelBump = lineWidth % 2 === 0 ? 0 : 0.5;
    var margin = Math.floor((size - space * (grid - 1)) / 2) + pixelBump;
    context.transform(1, 0, 0, 1, margin, margin);
    context.beginPath();
    labyrinth.forEach(function (point, index) {
        var x = point[0] * space;
        var y = point[1] * space;
        if (index === 0) {
            context.moveTo(x, y);
        }
        else {
            context.lineTo(x, y);
        }
    });
    context.closePath();
    context.stroke();
    return canvas;
}
document.addEventListener('DOMContentLoaded', function () {
    var input = document.createElement('input');
    input.type = 'text';
    input.value = 'dkstr18';
    document.body.appendChild(input);
    var week = document.createElement('input');
    week.type = 'number';
    week.value = '1';
    week.min = '1';
    week.max = '52';
    week.step = '1';
    document.body.appendChild(week);
    var div = document.createElement('div');
    document.body.appendChild(div);
    function draw() {
        var seed = input.value;
        var grid = parseInt(week.value, 10) * 2 + 1;
        var labyrinth = labyrinth_1.labyrinthAbs(grid, seed);
        var drawingParamsSeed = seed + week.value;
        div.innerHTML = '';
        div.appendChild(labyrinthToCanvas(labyrinth, grid, drawingParamsSeed));
    }
    input.onchange = draw;
    week.onchange = draw;
    draw();
});

},{"./labyrinth":2,"random-seed":4}],2:[function(require,module,exports){
"use strict";
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
exports.__esModule = true;
var RandomSeed = require('random-seed');
// const SIZE = 25;
// const MAX = Math.floor(SIZE / 2);
// const MIN = -1 * MAX;
var SCALE = 58;
// const BOARD = (SIZE + 1) * SCALE;
var RADIUS = 18;
var STROKE = 36;
var SYMMETRY = true;
var DEBUG = false;
var THICKNESS = 2;
var DEPTH = STROKE / 2;
// const PAGES = DEPTH / THICKNESS;
var PAGES = 1;
var LEFT = [-1, 0];
var RIGHT = [1, 0];
var UP = [0, -1];
var DOWN = [0, 1];
var DIR = [UP, DOWN, LEFT, RIGHT];
var Opposite = [
    1 /* Down */,
    0 /* Up */,
    3 /* Right */,
    2 /* Left */,
];
// const OPP = [DOWN, UP, RIGHT, LEFT];
var PRINT = ['↑', '↓', '←', '→'];
var X = 0;
var Y = 1;
function makeStart(size) {
    return [Math.floor(size / 2) - 1, Math.floor(size / 2) + 1];
}
var initial = [
    0 /* Up */,
    0 /* Up */,
    3 /* Right */,
    3 /* Right */,
    1 /* Down */,
    1 /* Down */,
    2 /* Left */,
    2 /* Left */,
];
function makeBoard(path, size) {
    var start = makeStart(size);
    var board = [];
    var length = size * size;
    for (var i = 0; i < length; i++) {
        board[i] = null;
    }
    var x = start[X];
    var y = start[Y];
    return path.reduce(function (board, direction, index, path) {
        var next = (index + 1) % path.length;
        board[y * size + x] = { direction: direction, point: [x, y], index: index, next: next };
        x += DIR[direction][X];
        y += DIR[direction][Y];
        return board;
    }, board);
}
function getBoardSpace(board, x, y, size) {
    var index = y * size + x;
    return board[index];
}
function boardToString(board, size) {
    return board.reduce(function (output, current, index, board) {
        var char = '. ';
        if (current != null) {
            char = PRINT[current.direction] + ' ';
        }
        if (index > 0 && (index + 1) % size === 0) {
            char += '\n';
        }
        return output + char;
    }, '');
}
function pathWithMutations(path, mutations) {
    return mutations.reduce(function (last, current, mutationIndex, array) {
        var index = current[0], direction = current[1];
        last.splice(index, 0, direction);
        var opposite = Opposite[direction];
        var index2 = (index + 2) % (last.length + 1);
        last.splice(index2, 0, opposite);
        if (SYMMETRY) {
            // TODO wrap bugs
            var len = last.length;
            var symIndex = (index + len / 2 + 1) % len;
            // if (symIndex === 0) {
            //   symIndex = len;
            // }
            last.splice(symIndex, 0, opposite);
            var symIndex2 = (symIndex + 2) % last.length;
            if (symIndex2 === 0) {
                symIndex2 = last.length;
            }
            last.splice(symIndex2, 0, direction);
        }
        return last;
    }, path.slice());
}
function makeAbsPath(path, start) {
    var x = start[X];
    var y = start[Y];
    return path.map(function (direction) {
        var absolutePoint = [x, y];
        x += DIR[direction][X];
        y += DIR[direction][Y];
        return absolutePoint;
    });
}
function getPossibleMutations(path, size) {
    var board = makeBoard(path, size);
    return board.reduce(function (possible, boardSpace, boardIndex, board) {
        if (!boardSpace)
            return possible;
        var direction = boardSpace.direction, point = boardSpace.point, index = boardSpace.index, next = boardSpace.next;
        var nextDirection = path[next];
        var x = point[0], y = point[1];
        switch (direction) {
            case 0 /* Up */:
                if ((nextDirection === 0 /* Up */ ||
                    nextDirection === 3 /* Right */) &&
                    x > 0 &&
                    y > 0) {
                    var bump1 = getBoardSpace(board, x - 1, y, size);
                    var bump2 = getBoardSpace(board, x - 1, y - 1, size);
                    if (!bump1 && !bump2) {
                        possible.push([index, 2 /* Left */]);
                    }
                }
                break;
            case 1 /* Down */:
                if ((nextDirection === 1 /* Down */ ||
                    nextDirection === 2 /* Left */) &&
                    x < size - 1 &&
                    y < size - 1) {
                    var bump1 = getBoardSpace(board, x + 1, y, size);
                    var bump2 = getBoardSpace(board, x + 1, y + 1, size);
                    if (!bump1 && !bump2) {
                        possible.push([index, 3 /* Right */]);
                    }
                }
                break;
            case 2 /* Left */:
                if ((nextDirection === 2 /* Left */ ||
                    nextDirection === 0 /* Up */) &&
                    x > 0 &&
                    y < size - 1) {
                    var bump1 = getBoardSpace(board, x, y + 1, size);
                    var bump2 = getBoardSpace(board, x - 1, y + 1, size);
                    if (!bump1 && !bump2) {
                        possible.push([index, 1 /* Down */]);
                    }
                }
                break;
            case 3 /* Right */:
                if ((nextDirection === 3 /* Right */ ||
                    nextDirection === 1 /* Down */) &&
                    x < size - 1 &&
                    y > 0) {
                    var bump1 = getBoardSpace(board, x, y - 1, size);
                    var bump2 = getBoardSpace(board, x + 1, y - 1, size);
                    if (!bump1 && !bump2) {
                        possible.push([index, 0 /* Up */]);
                    }
                }
                break;
            default:
                break;
        }
        return possible;
    }, []);
}
function logPath(path, size) {
    console.log(path.map(function (i) { return PRINT[i]; }).join(' '));
    console.log(boardToString(makeBoard(path, size), size));
}
function randomMutations(path, size, seed) {
    var Seeded = RandomSeed.create(seed);
    var mutations = [];
    if (DEBUG) {
        logPath(path, size);
    }
    var possible = getPossibleMutations(path, size);
    while (possible.length > 0) {
        var mutation = possible[Math.floor(Seeded.random() * possible.length)];
        mutations.push(mutation);
        var currentPath = pathWithMutations(path, mutations);
        if (DEBUG) {
            logPath(currentPath, size);
        }
        possible = getPossibleMutations(currentPath, size);
        if (mutations.length > size * size) {
            console.error('oops');
            return;
        }
    }
    return mutations;
}
function labyrinth(size, seed) {
    var mutations = randomMutations(initial, size, seed);
    return pathWithMutations(initial, mutations);
}
exports["default"] = labyrinth;
function labyrinthAbs(size, seed) {
    return makeAbsPath(labyrinth(size, seed), makeStart(size));
}
exports.labyrinthAbs = labyrinthAbs;

},{"random-seed":4}],3:[function(require,module,exports){
exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}

},{}],4:[function(require,module,exports){
/*
 * random-seed
 * https://github.com/skratchdot/random-seed
 *
 * This code was originally written by Steve Gibson and can be found here:
 *
 * https://www.grc.com/otg/uheprng.htm
 *
 * It was slightly modified for use in node, to pass jshint, and a few additional
 * helper functions were added.
 *
 * Copyright (c) 2013 skratchdot
 * Dual Licensed under the MIT license and the original GRC copyright/license
 * included below.
 */
/*	============================================================================
									Gibson Research Corporation
				UHEPRNG - Ultra High Entropy Pseudo-Random Number Generator
	============================================================================
	LICENSE AND COPYRIGHT:  THIS CODE IS HEREBY RELEASED INTO THE PUBLIC DOMAIN
	Gibson Research Corporation releases and disclaims ALL RIGHTS AND TITLE IN
	THIS CODE OR ANY DERIVATIVES. Anyone may be freely use it for any purpose.
	============================================================================
	This is GRC's cryptographically strong PRNG (pseudo-random number generator)
	for JavaScript. It is driven by 1536 bits of entropy, stored in an array of
	48, 32-bit JavaScript variables.  Since many applications of this generator,
	including ours with the "Off The Grid" Latin Square generator, may require
	the deteriministic re-generation of a sequence of PRNs, this PRNG's initial
	entropic state can be read and written as a static whole, and incrementally
	evolved by pouring new source entropy into the generator's internal state.
	----------------------------------------------------------------------------
	ENDLESS THANKS are due Johannes Baagoe for his careful development of highly
	robust JavaScript implementations of JS PRNGs.  This work was based upon his
	JavaScript "Alea" PRNG which is based upon the extremely robust Multiply-
	With-Carry (MWC) PRNG invented by George Marsaglia. MWC Algorithm References:
	http://www.GRC.com/otg/Marsaglia_PRNGs.pdf
	http://www.GRC.com/otg/Marsaglia_MWC_Generators.pdf
	----------------------------------------------------------------------------
	The quality of this algorithm's pseudo-random numbers have been verified by
	multiple independent researchers. It handily passes the fermilab.ch tests as
	well as the "diehard" and "dieharder" test suites.  For individuals wishing
	to further verify the quality of this algorithm's pseudo-random numbers, a
	256-megabyte file of this algorithm's output may be downloaded from GRC.com,
	and a Microsoft Windows scripting host (WSH) version of this algorithm may be
	downloaded and run from the Windows command prompt to generate unique files
	of any size:
	The Fermilab "ENT" tests: http://fourmilab.ch/random/
	The 256-megabyte sample PRN file at GRC: https://www.GRC.com/otg/uheprng.bin
	The Windows scripting host version: https://www.GRC.com/otg/wsh-uheprng.js
	----------------------------------------------------------------------------
	Qualifying MWC multipliers are: 187884, 686118, 898134, 1104375, 1250205,
	1460910 and 1768863. (We use the largest one that's < 2^21)
	============================================================================ */
'use strict';
var stringify = require('json-stringify-safe');

/*	============================================================================
This is based upon Johannes Baagoe's carefully designed and efficient hash
function for use with JavaScript.  It has a proven "avalanche" effect such
that every bit of the input affects every bit of the output 50% of the time,
which is good.	See: http://baagoe.com/en/RandomMusings/hash/avalanche.xhtml
============================================================================
*/
var Mash = function () {
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
};

var uheprng = function (seed) {
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
				seed = Math.random();
			}
			if (typeof seed !== 'string') {
				seed = stringify(seed, function (key, value) {
					if (typeof value === 'function') {
						return (value).toString();
					}
					return value;
				});
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
};

// Modification for use in node:
uheprng.create = function (seed) {
	return new uheprng(seed);
};
module.exports = uheprng;

},{"json-stringify-safe":3}]},{},[1]);
