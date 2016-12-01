# http://jsbin.com/nuhozo/7/edit?js,output

WIDTH = 500
HEIGHT = 500
MID = [WIDTH/2, HEIGHT/2]
COUNT = 7
SPACING = WIDTH / (COUNT + 1)
SIZE = 20
SIZE_HALF = SIZE / 2
Z_OFFSET = -0.333333

scrollX = 0
scrollY = 0

canvas = document.createElement 'canvas'
document.body.appendChild canvas
canvas.style.maxWidth = '100%'
context = canvas.getContext '2d'
canvas.width = WIDTH
canvas.height = HEIGHT


draw = () ->
  context.fillStyle = 'white'
  context.fillRect(0, 0, WIDTH, HEIGHT)
  context.fillStyle = 'rgba(255, 255, 255, 0.5)'
  
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
      #context.fillRect(topX - SIZE_HALF, topY - SIZE_HALF, SIZE, SIZE)
      context.strokeRect(topX - SIZE_HALF, topY - SIZE_HALF, SIZE, SIZE)
    
animate = () ->
  requestAnimationFrame(animate)
  scrollX = (Date.now() / 50) % SPACING
  scrollY = (Date.now() / 50) % SPACING
  draw()
  
animate()
