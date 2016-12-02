Canvas = require('canvas')
path = require('path')
fs = require('fs')
padLeft = require('pad-left')

{WIDTH, HEIGHT, SPACING, draw} = require './flyover-00'

FRAME_COUNT = Math.floor(SPACING)
FRAME_DIGITS = String(FRAME_COUNT).length

canvas = new Canvas(WIDTH, HEIGHT)
context = canvas.getContext('2d')
for i in [0..FRAME_COUNT]
  SCROLL = i
  draw(context, SCROLL, SCROLL)

  STAMP = padLeft(i, FRAME_DIGITS, '0')
  console.log("writing " + STAMP)
  filePath = path.resolve(process.cwd(), 'output', 'fly' + STAMP + '.png')
  fs.writeFileSync(filePath, canvas.toBuffer())
