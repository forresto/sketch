# http://jsbin.com/nuhozo/edit?js,output

WIDTH = 720
HEIGHT = 720
MID = [WIDTH / 2, HEIGHT / 2]
COUNT = 13
SPACING = WIDTH / (COUNT + 1)
SIZE = SPACING / 4
SIZE_HALF = SIZE / 2
Z_OFFSET = -1 / 8
GRID_COUNT = WIDTH / SIZE_HALF

BG = 'hsl(60, 10%, 95%)'
GRID = 'hsl(60, 10%, 80%)'
FG = 'hsl(60, 10%, 35%)'

draw = (context, scrollX=0, scrollY=0) ->
  context.fillStyle = BG
  context.strokeStyle = FG
  context.fillRect(0, 0, WIDTH, HEIGHT)

  # grid
  context.strokeStyle = GRID
  for g in [-8...GRID_COUNT+16]
    gx = g * SIZE_HALF + scrollX
    gy = g * SIZE_HALF + scrollY
    context.beginPath()
    context.moveTo(0 - SPACING * 2, gy)
    context.lineTo(WIDTH + SPACING * 4, gy)
    context.moveTo(gx, 0 - SPACING * 2)
    context.lineTo(gx, HEIGHT + SPACING * 4)
    context.stroke()

  context.strokeStyle = FG
  for x in [-1...COUNT+2]
    for y in [-1...COUNT+2]
      posX = x * SPACING + scrollX
      posY = y * SPACING + scrollY
      topX = posX + (MID[0] - posX) * Z_OFFSET
      topY = posY + (MID[1] - posY) * Z_OFFSET
      
      # bottom
      context.strokeRect(posX - SIZE_HALF, posY - SIZE_HALF, SIZE, SIZE)

      # sides
      context.beginPath()
      context.moveTo(posX - SIZE_HALF, posY - SIZE_HALF)
      context.lineTo(topX - SIZE_HALF, topY - SIZE_HALF)
      context.moveTo(posX - SIZE_HALF, posY + SIZE_HALF)
      context.lineTo(topX - SIZE_HALF, topY + SIZE_HALF)
      context.moveTo(posX + SIZE_HALF, posY + SIZE_HALF)
      context.lineTo(topX + SIZE_HALF, topY + SIZE_HALF)
      context.moveTo(posX + SIZE_HALF, posY - SIZE_HALF)
      context.lineTo(topX + SIZE_HALF, topY - SIZE_HALF)
      context.closePath()
      context.stroke()

      # top
      context.strokeRect(topX - SIZE_HALF, topY - SIZE_HALF, SIZE, SIZE)
    
if document?
  canvas = document.createElement 'canvas'
  document.body.appendChild canvas
  canvas.style.maxWidth = '100%'
  context = canvas.getContext '2d'
  canvas.width = WIDTH
  canvas.height = HEIGHT

  animate = () ->
    requestAnimationFrame(animate)
    scrollX = ((Date.now() / 2000) * 50) % SPACING
    scrollY = scrollX
    draw(context, scrollX, scrollY)
    
  animate()

module.exports = {WIDTH, HEIGHT, SPACING, draw}
