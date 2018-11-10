// URL: https://beta.observablehq.com/@forresto/d3-azimuthal-cities-straight-line-routes
// Title: Azimuthal Artifact
// Author: Forrest Oliphant (@forresto)
// Version: 280
// Runtime version: 1

const m0 = {
  id: "e6547e85ad478b83@280",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Azimuthal Artifact

Todo:
- Make a new non-equidistant (logarithmic?) azimuthal projection, to give closer locations more room
- Place names around edge
- Experiment with design to make it suitable for laser engraving

Non-map version, designed as artifact to have spatial intuition of friends, family, memories...
![](https://c2.staticflickr.com/2/1940/43785173620_0b8b5cc6cb_b.jpg)
`
)})
    },
    {
      name: "viewof center",
      inputs: ["html","cities","option"],
      value: (function(html,cities,option)
{
  const form = html`
<form><select name=select>
  ${cities.map(option)}
  <!--
  <option value="[0, 0]">Standard aspect</option>
  <option value="[0, 90]">North polar aspect</option>
  <option value="[0, -90]">South polar aspect</option>
  -->
</select></form>`;
  form.oninput = () => (form.value = JSON.parse(form.select.value));
  form.oninput();
  return form;
}
)
    },
    {
      name: "center",
      inputs: ["Generators","viewof center"],
      value: (G, _) => G.input(_)
    },
    {
      name: "map",
      inputs: ["DOM","width","height","d3","projection","graticule","land","sphere","lines"],
      value: (function(DOM,width,height,d3,projection,graticule,land,sphere,lines)
{
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.beginPath(),
    path(graticule),
    (context.strokeStyle = "#eee"),
    context.stroke();
  context.beginPath(),
    path(land),
    (context.strokeStyle = "#aaa"),
    context.stroke();
  context.beginPath(),
    path(sphere),
    (context.strokeStyle = "#000"),
    context.stroke();
  context.beginPath(),
    path(lines),
    (context.strokeStyle = "#000"),
    context.stroke();
  return context.canvas;
}
)
    },
    {
      name: "viewof zoom",
      inputs: ["html"],
      value: (function(html){return(
html`<input type=range min=-500 max=500 value=1>`
)})
    },
    {
      name: "zoom",
      inputs: ["Generators","viewof zoom"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof rotateOffset",
      inputs: ["html"],
      value: (function(html){return(
html`<input type=range min=-360 max=360 value=0></input>`
)})
    },
    {
      name: "rotateOffset",
      inputs: ["Generators","viewof rotateOffset"],
      value: (G, _) => G.input(_)
    },
    {
      name: "rotate",
      inputs: ["center","rotateOffset"],
      value: (function(center,rotateOffset)
{
  const r = center.map(x => -x);
  r[0] += rotateOffset;
  return r;
}
)
    },
    {
      name: "projection",
      inputs: ["d3","rotate","width","height","zoom","sphere"],
      value: (function(d3,rotate,width,height,zoom,sphere){return(
d3
  .geoAzimuthalEquidistant()
  .rotate(rotate)
  .translate([width / 2, height / 2])
  .fitExtent([[zoom, zoom], [width - zoom, height - zoom]], sphere)
  .precision(0.1)
)})
    },
    {
      name: "height",
      inputs: ["width"],
      value: (function(width){return(
Math.max(640, width)
)})
    },
    {
      name: "cities",
      value: (function(){return(
[
  ["Tokyo", 35.685, 139.7514],
  ["New York", 40.6943, -73.9249],
  ["Mexico City", 19.4424, -99.131],
  ["Mumbai", 19.017, 72.857],
  ["Sao Paulo", -23.5587, -46.625],
  ["Delhi", 28.67, 77.23],
  ["Shanghai", 31.2165, 121.4365],
  ["Kolkata", 22.495, 88.3247],
  ["Dhaka", 23.7231, 90.4086],
  ["Buenos Aires", -34.6025, -58.3975],
  ["Los Angeles", 34.114, -118.4068],
  ["Karachi", 24.87, 66.99],
  ["Cairo", 30.05, 31.25],
  ["Rio de Janeiro", -22.925, -43.225],
  ["Osaka", 34.75, 135.4601],
  ["Beijing", 39.9289, 116.3883],
  ["Manila", 14.6042, 120.9822],
  ["Moscow", 55.7522, 37.6155],
  ["Istanbul", 41.105, 29.01],
  ["Paris", 48.8667, 2.3333],
  ["Seoul", 37.5663, 126.9997],
  ["Lagos", 6.4433, 3.3915],
  ["Jakarta", -6.1744, 106.8294],
  ["Guangzhou", 23.145, 113.325],
  ["Chicago", 41.8373, -87.6861],
  ["London", 51.5, -0.1167]
].map(([name, lat, lon]) => [name, lon, lat])
)})
    },
    {
      name: "lines",
      inputs: ["cities","center"],
      value: (function(cities,center){return(
{
  type: "MultiLineString",
  coordinates: cities.map(([_, lon, lat]) => [center, [lon, lat]])
}
)})
    },
    {
      name: "option",
      inputs: ["html"],
      value: (function(html){return(
([name, lon, lat]) =>
  html`<option value="[${lon}, ${lat}]">${name}</option>`
)})
    },
    {
      name: "sphere",
      value: (function(){return(
{type: "Sphere"}
)})
    },
    {
      name: "graticule",
      inputs: ["d3"],
      value: (function(d3){return(
d3.geoGraticule10()
)})
    },
    {
      name: "land",
      inputs: ["topojson","world"],
      value: (function(topojson,world){return(
topojson.feature(world, world.objects.land)
)})
    },
    {
      name: "world",
      value: (function(){return(
fetch("https://unpkg.com/world-atlas@1/world/110m.json").then(
  response => response.json()
)
)})
    },
    {
      name: "topojson",
      inputs: ["require"],
      value: (function(require){return(
require("topojson-client@3")
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3-geo@1")
)})
    }
  ]
};

const notebook = {
  id: "e6547e85ad478b83@280",
  modules: [m0]
};

export default notebook;
