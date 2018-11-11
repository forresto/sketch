// URL: https://beta.observablehq.com/@forresto/kitkit
// Title: KitKit
// Author: Forrest Oliphant (@forresto)
// Version: 945
// Runtime version: 1

const m0 = {
  id: "9a1587c3253575d7@945",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# KitKit

### ⚠️ This is WIP

.

.

.

⧉ Custom tiny shelf / case divider generator

_(Testing Maker.js in Observable)_

Open design, with inspiration from [opendesk.cc](https://www.opendesk.cc/). If you sell things made from this design, may I suggest a “design royalty” or tip of 8%, to encourage future development. 🙇‍♂️

---

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
`
)})
    },
    {
      name: "viewof layout",
      inputs: ["width","DOM","HORIZONTAL","X","Y","SIZE"],
      value: (function(width,DOM,HORIZONTAL,X,Y,SIZE)
{
  const devicePixelRatio = window.devicePixelRatio || 1;
  const w = width * devicePixelRatio;
  const h = Math.floor((w * 2) / 4);
  const canvas = DOM.canvas(w, h);
  canvas.style.width = w / devicePixelRatio + "px";
  canvas.style.height = h / devicePixelRatio + "px";
  const context = canvas.getContext("2d");

  let pixelsPerUnit = 12 * devicePixelRatio;

  // Local state
  let mouseX = 0;
  let mouseY = 0;
  let startX = null;
  let startY = null;

  const initialState = [
    [1, 1, true, 35],
    [1, 22, true, 35],
    [1, 1, false, 21],
    [23, 1, false, 21],
    [36, 1, false, 21],
    [23, 14, true, 13],
    [28, 14, false, 8],
    [23, 17, true, 5],
    [26, 14, false, 3]
  ];
  let state = null;
  setState(initialState);

  function makeWall(startX, mouseX, startY, mouseY) {
    const dX = Math.abs(mouseX - startX);
    const dY = Math.abs(mouseY - startY);
    const horizontal = dX > dY;
    return horizontal
      ? [startX < mouseX ? startX : mouseX, startY, horizontal, dX]
      : [startX, startY < mouseY ? startY : mouseY, horizontal, dY];
  }

  function drawWall(wall) {
    if (wall[HORIZONTAL]) {
      context.strokeRect(
        wall[X] * pixelsPerUnit + 0 * devicePixelRatio,
        wall[Y] * pixelsPerUnit + 0 * devicePixelRatio,
        (wall[SIZE] + 1) * pixelsPerUnit + 1 * devicePixelRatio,
        pixelsPerUnit + 1 * devicePixelRatio
      );
    } else {
      context.strokeRect(
        wall[X] * pixelsPerUnit + 0 * devicePixelRatio,
        wall[Y] * pixelsPerUnit + 0 * devicePixelRatio,
        pixelsPerUnit + 1 * devicePixelRatio,
        (wall[SIZE] + 1) * pixelsPerUnit + 1 * devicePixelRatio
      );
    }
  }

  function draw() {
    context.clearRect(0, 0, w, h);
    // Grid
    let x = 0; // Math.floor(pixelsPerUnit / 2);
    let y = 0; // Math.floor(pixelsPerUnit / 2);
    while (x < w) {
      while (y < h) {
        context.fillRect(x, y, 1 * devicePixelRatio, 1 * devicePixelRatio);
        y += pixelsPerUnit;
      }
      x += pixelsPerUnit;
      y = 0; // Math.floor(pixelsPerUnit / 2);
    }
    // Walls
    state.forEach(drawWall);
    // Mouse
    context.strokeRect(
      mouseX * pixelsPerUnit + 0 * devicePixelRatio,
      mouseY * pixelsPerUnit + 0 * devicePixelRatio,
      pixelsPerUnit + 1 * devicePixelRatio,
      pixelsPerUnit + 1 * devicePixelRatio
    );
    // Preview
    if (startX && (mouseX !== startX || mouseY !== startY)) {
      context.strokeS;
      context.setLineDash([devicePixelRatio, devicePixelRatio]);
      drawWall(makeWall(startX, mouseX, startY, mouseY));
      context.setLineDash([]);
    }
  }
  draw();
  const rafDraw = () => requestAnimationFrame(draw);

  function setMouse(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = Math.floor(
      ((e.clientX - rect.left) / pixelsPerUnit) * devicePixelRatio
    );
    mouseY = Math.floor(
      ((e.clientY - rect.top) / pixelsPerUnit) * devicePixelRatio
    );
    rafDraw();
  }
  canvas.addEventListener("mousemove", setMouse);

  function pushWallToState(wall) {
    const existingIndex = state.findIndex(
      w =>
        w[X] === wall[X] &&
        w[Y] === wall[Y] &&
        w[HORIZONTAL] === wall[HORIZONTAL] &&
        w[SIZE] === wall[SIZE]
    );
    if (existingIndex === -1) {
      // Add new wall
      const newState = state.slice();
      newState.push(wall);
      return newState;
    } else {
      // Remove existing wall
      const newState = state.slice();
      newState.splice(existingIndex, 1);
      return newState;
    }
    return state;
  }

  // Start line
  function click(e) {
    if (startX) {
      if (startX !== mouseX || startY !== mouseY) {
        setState(pushWallToState(makeWall(startX, mouseX, startY, mouseY)));
      }
      startX = null;
      startY = null;
    } else {
      startX = mouseX;
      startY = mouseY;
    }
    rafDraw();
  }
  canvas.addEventListener("click", click);

  function setState(newState) {
    state = newState;
    canvas.value = state;
    canvas.dispatchEvent(new CustomEvent("input"));
  }

  return canvas;
}
)
    },
    {
      name: "layout",
      inputs: ["Generators","viewof layout"],
      value: (G, _) => G.input(_)
    },
    {
      name: "X",
      value: (function(){return(
0
)})
    },
    {
      name: "Y",
      value: (function(){return(
1
)})
    },
    {
      name: "HORIZONTAL",
      value: (function(){return(
2
)})
    },
    {
      name: "SIZE",
      value: (function(){return(
3
)})
    },
    {
      inputs: ["layout"],
      value: (function(layout){return(
layout
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## App state ☝️
\`layout\` is the simplest representation of the design. \`derivedState\` 👇 calculates the intersections of each piece, and is generated reactively, when \`layout\` changes.`
)})
    },
    {
      name: "derivedState",
      value: (function(){return(
"WIP"
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`We're basing the default “unit” dimensions on 1/8" cardboard or plywood, so cutting a 1 unit by 1 unit square would make a 1/8 x 1/8 x 1/8" cube.`
)})
    },
    {
      inputs: ["makerjs"],
      value: (function(makerjs){return(
makerjs.unitType
)})
    },
    {
      name: "viewof unitType",
      inputs: ["html","makerjs"],
      value: (function(html,makerjs){return(
html`<select>${Object.entries(makerjs.unitType).map(
  ([k, v]) =>
    html`<option value=${v} ${
      v === makerjs.unitType.Inch ? "selected" : ""
    }>${k}</option>`
)}</select>`
)})
    },
    {
      name: "unitType",
      inputs: ["Generators","viewof unitType"],
      value: (G, _) => G.input(_)
    },
    {
      name: "svgLengthType",
      inputs: ["unitType"],
      value: (function(unitType)
{
  return { cm: 6, foot: undefined, inch: 8, m: undefined, mm: 7 }[unitType];
}
)
    },
    {
      name: "unit",
      value: (function(){return(
1 / 8
)})
    },
    {
      name: "tabRound",
      inputs: ["unit"],
      value: (function(unit){return(
unit / 8
)})
    },
    {
      name: "thick",
      value: (function(){return(
9
)})
    },
    {
      name: "drawing",
      inputs: ["makerjs","unit","tabRound","thick","unitType","html"],
      value: (function(makerjs,unit,tabRound,thick,unitType,html)
{
  function stick(w, h) {
    let s = new makerjs.models.Rectangle(unit * w, unit * h);

    const tab = new makerjs.models.RoundRectangle(unit, unit * 2, tabRound);
    const row = makerjs.layout.cloneToRow(tab, Math.ceil(h / 2) - 1);
    const inset = {
      type: "line",
      origin: [unit * (w + 1), (unit * 3) / 2],
      end: [unit * (w + 1), unit * h - (unit * 3) / 2]
    };
    const combIn = makerjs.layout.childrenOnPath(row, inset);
    s = makerjs.model.combineUnion(s, combIn);
    // return s;

    const tabOut = new makerjs.models.RoundRectangle(unit, unit * 2, tabRound);
    const rowOut = makerjs.layout.cloneToRow(tabOut, Math.ceil(h / 2));
    const lineOut = {
      type: "line",
      origin: [unit, unit / 2],
      end: [unit, unit * h - unit / 2]
    };
    const combOut = makerjs.layout.childrenOnPath(rowOut, lineOut);
    s = makerjs.model.combineUnion(s, combOut);

    return s;
  }

  const model = {
    models: {
      t: makerjs.model.move(stick(24, thick), [unit, 0]),
      b: makerjs.model.move(stick(24, thick), [unit * 26, 0]),
      l: makerjs.model.move(stick(24, thick), [unit, unit * thick]),
      r: makerjs.model.move(stick(24, thick), [unit * 26, unit * thick])
    },
    units: unitType
  };

  makerjs.model.originate(model);
  makerjs.model.simplify(model);
  const svg = makerjs.exporter.toSVG(model);
  return html`${svg}`;
}
)
    },
    {
      inputs: ["html","drawing"],
      value: (function(html,drawing){return(
html`<button onClick="${() => {
  console.log(drawing);
  window.open("data:image/svg+xml;utf8," + drawing.outerHTML);
}}">Download (??)</button>`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Laser preview 👓
A preview of Maker.js' path simplification, for efficient cutting/plotting:`
)})
    },
    {
      name: "viewof timeStart",
      inputs: ["html"],
      value: (function(html)
{
  const b = html`<button>start</button>`;
  b.onclick = () => (b.value = Date.now());
  b.click();
  return b;
}
)
    },
    {
      name: "timeStart",
      inputs: ["Generators","viewof timeStart"],
      value: (G, _) => G.input(_)
    },
    {
      name: "timeCheck",
      inputs: ["now","timeStart","progress","mutable progress"],
      value: (function(now,timeStart,progress,$0)
{
  const check = Math.min(1, (now - timeStart) / 10000);
  if (progress !== check) {
    $0.value = check;
    return true;
  }
  return false;
}
)
    },
    {
      name: "initial progress",
      value: (function(){return(
0
)})
    },
    {
      name: "mutable progress",
      inputs: ["Mutable","initial progress"],
      value: (M, _) => new M(_)
    },
    {
      name: "progress",
      inputs: ["mutable progress"],
      value: _ => _.generator
    },
    {
      inputs: ["html","progress"],
      value: (function(html,progress){return(
html`<input type="range" value=${progress} min=0 max=1 step=0.001 style="min-width: 60%">`
)})
    },
    {
      name: "laser",
      inputs: ["drawing","svg"],
      value: (function(drawing,svg)
{
  const laser = drawing.cloneNode(true);
  const path = laser.querySelector("path");
  const circle = svg`<circle fill=red cx=0 cy=0 r=0.05>`;
  laser.appendChild(circle);
  return laser;
}
)
    },
    {
      name: "circle",
      inputs: ["laser"],
      value: (function(laser){return(
laser.querySelector("circle")
)})
    },
    {
      name: "path",
      inputs: ["laser"],
      value: (function(laser){return(
laser.querySelector("path")
)})
    },
    {
      name: "pathLength",
      inputs: ["path"],
      value: (function(path){return(
path.getTotalLength()
)})
    },
    {
      name: "pathLengthPx",
      inputs: ["laser","svgLengthType","pathLength","SVGLength"],
      value: (function(laser,svgLengthType,pathLength,SVGLength)
{
  const l = laser.createSVGLength();
  l.newValueSpecifiedUnits(svgLengthType, pathLength);
  l.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX);
  return l.valueInSpecifiedUnits;
}
)
    },
    {
      name: "laserAnimation",
      inputs: ["path","progress","pathLength","circle"],
      value: (function(path,progress,pathLength,circle)
{
  // const percent = Math.min(1, (now - startTime) / 10000);
  const point = path.getPointAtLength(progress * pathLength);
  circle.setAttribute("cx", point.x);
  circle.setAttribute("cy", point.y);
  // The following stroke animation doesn't work, because pathLength is inches (??)
  // path.style.strokeDasharray = pathLengthPx;
  // path.style.strokeDashoffset = -progress * pathLengthPx;
  return progress;
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Libs 📚
* SVG: [SVGLength](https://developer.mozilla.org/en-US/docs/Web/API/SVGLength)
* Maker.js: [docs](https://maker.js.org/docs/#content)`
)})
    },
    {
      name: "makerjs",
      inputs: ["require"],
      value: (function(require){return(
require("https://bundle.run/makerjs@0.12.1")
)})
    }
  ]
};

const notebook = {
  id: "9a1587c3253575d7@945",
  modules: [m0]
};

export default notebook;
