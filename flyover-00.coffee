# http://jsbin.com/nuhozo/11/edit?js,output

WIDTH = 720
HEIGHT = 720
MID = [WIDTH/2, HEIGHT/2]
COUNT = 7
SPACING = WIDTH / (COUNT + 1)
SIZE = SPACING / 4
SIZE_HALF = SIZE / 2
Z_OFFSET = -1/8

BG = 'hsl(60, 10%, 95%)'
GRID = 'hsl(60, 10%, 70%)'
FG = 'hsl(60, 10%, 20%)'

scrollX = 0
scrollY = 0

canvas = document.createElement 'canvas'
document.body.appendChild canvas
canvas.style.maxWidth = '100%'
WIDTH = 720
HEIGHT = 720
MID = [WIDTH/2, HEIGHT/2]
COUNT = 7
SPACING = WIDTH / (COUNT + 1)
SIZE = SPACING / 4
SIZE_HALF = SIZE / 2
Z_OFFSET = -1/8

BG = 'hsl(60, 10%, 95%)'
GRID = 'hsl(60, 10%, 70%)'
FG = 'hsl(60, 10%, 20%)'

scrollX = 0
scrollY = 0

canvas = document.createElement 'canvas'
document.body.appendChild canvas
canvas.style.maxWidth = '100%'
context = canvas.getContext '2d'
canvas.width = WIDTH
canvas.height = HEIGHT

context.fillStyle = BG
context.strokeStyle = FG

draw = () ->
  context.fillRect(0, 0, WIDTH, HEIGHT)
  
  for x in [-1...COUNT+2]
    for y in [-1...COUNT+2]
      posX = x * SPACING + scrollX
      posY = y * SPACING + scrollY
      topX = posX + (MID[0] - posX) * Z_OFFSET
      topY = posY + (MID[1] - posY) * Z_OFFSET
      
      # grid
      context.strokeStyle = GRID
      for gx in [0...8]
        for gy in [0...8]
          gxc = posX + (gx * SIZE_HALF)
          gyc = posY + (gy * SIZE_HALF)
          context.beginPath()
          context.moveTo(gxc + SIZE_HALF, gyc)
          context.lineTo(gxc, gyc)
          context.lineTo(gxc, gyc + SIZE_HALF)
          context.stroke()

      # bottom
      context.strokeStyle = FG
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
    
animate = () ->
  requestAnimationFrame(animate)
  scrollX = ((Date.now() / 2000) * 50) % SPACING
  scrollY = scrollX
  draw()
  
animate()
#draw()
