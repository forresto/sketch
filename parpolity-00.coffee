# See it: http://jsbin.com/xiheveh/9/edit?js,output

WIDTH = 1000
HEIGHT = 1000

TAU = Math.PI * 2
COUNCIL_SIZE = 51
EXP = 5
DX = WIDTH/(COUNCIL_SIZE+1)
DY = HEIGHT/(EXP+1)
FONTSIZE = 25
FONT =  FONTSIZE + 'px sans-serif'

representative = [0,15,25,35,45]
labels = [
  'nation - 51 rep 345M'
  'state* - 51 represent 6.8M'
  'region - 51 represent 132,651'
  'local council - 51 represent 2,601'
  'neighbor council - 51 people - you are here👆. send one rep to local council'
]

canvas = document.createElement 'canvas'
document.body.appendChild canvas
canvas.style.maxWidth = '100%'
context = canvas.getContext '2d'
canvas.width = WIDTH
canvas.height = HEIGHT

drawCircle = (x, y, r) ->
  context.beginPath()
  context.arc(x, y, r, 0, TAU)
  context.fill()
  context.stroke()
  
drawCurve = (x1, y1, x2, y2) ->
  context.beginPath()
  context.moveTo(x1, y1)
  context.bezierCurveTo(x1, y1-(DY/2), x2, y2+(DY/2), x2, y2)
  context.stroke()

context.fillStyle = 'white'
context.fillRect(0, 0, WIDTH, HEIGHT)

context.strokeStyle = 'rgba(0, 0, 0, 0.5)'
context.lineWidth = 2
for level in [0...EXP]
  for member in [0...COUNCIL_SIZE]
    x = DX * (member+1)
    y = DY * (level+1)
    unless level is 0
      prevX = (representative[level] + 1) * DX
      drawCurve(x, y, prevX, y-DY)
      
context.strokeStyle = 'black'
context.fillStyle = 'white'
for level in [0...EXP]
  for member in [0...COUNCIL_SIZE]
    x = DX * (member+1)
    y = DY * (level+1)
    drawCircle(x, y, 7)

context.fillStyle = 'black'
context.font = FONT
for level in [0...EXP]
   y = DY * (level+1)
   context.fillText(labels[level], 10, y+FONTSIZE+5)
