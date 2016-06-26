
TAU = Math.PI * 2

canvas = document.createElement 'canvas'
document.body.appendChild canvas
context = canvas.getContext '2d'
width = canvas.width = 500
height = canvas.height = 500
rows = 25
columns = 25
pixel_width = width / columns
pixel_height = height / rows
count = rows * columns
rope = [[1, 0], [0, 1], [-1, 0], [0, -1]]
field = []

random_direction = ->
  r = Math.random()
  if r > 0.75
    return [-1, 0]
  if r > 0.5
    return [1, 0]
  if r > 0.25
    return [0, -1]
  return [0, 1]
  
valid = (pixel, x, y) ->
  px = x + pixel[0]
  py = y + pixel[1]
  return (0 < px < columns) && (0 < py < rows) && (field[px * columns + py] isnt true)

opposite = (pixel) ->
  return [pixel[0] * -1, pixel[1] * -1]

animate = ->
  requestAnimationFrame animate
  field = []
  
  x = 1
  y = 1
  for pixel, i in rope
    x += pixel[0]
    y += pixel[1]
    field[x * columns + y] = true
  
  x = 1
  y = 1
  for pixel, i in rope
    x += pixel[0]
    y += pixel[1]
    dir = random_direction()
    o_dir = opposite dir
    if (i < rope.length-3) and valid(dir, x, y) #and valid(pixel, x+dir[0], y+dir[1]) #and valid(o_dir, x+dir[0]+pixel[0], y+dir[1]+pixel[1])
      rope.splice(i, 0, dir)
      rope.splice(i+3, 0, o_dir)
      break
      
  x = 1
  y = 1
  context.clearRect 0, 0, width, height
  context.beginPath()
  context.moveTo pixel_width, pixel_height
  for pixel, i in rope
    x += pixel[0]
    y += pixel[1]
    context.lineTo x * pixel_width, y * pixel_height
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.strokeStyle = 'black'
  context.lineWidth = 16
  context.stroke()
  context.strokeStyle = 'white'
  context.lineWidth = 12
  context.stroke()
#   context.strokeStyle = 'black'
#   context.lineWidth = 8
#   context.stroke()
#   context.strokeStyle = '#eee'
#   context.lineWidth = 4
#   context.stroke()
  
animate()




