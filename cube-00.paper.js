var center = new Point(350, 350)
var layer = new Layer()
var TAU = Math.PI * 2
var firstFrame = true
var paths = []
var colors = [new Color(1, 0.75)]
var baseHue = Math.random() * 240
for (var i = 0; i < 4; i++) {
    colors.push(new Color(
        { hue: Math.random() * 120 + baseHue
        , saturation: 0.75
        , lightness: 0.5
        , alpha: 0.75
        }
    ))
}

function iso (angle, point) {
    return new Point(Math.sin(angle+TAU/6)*point.x, Math.cos(angle+TAU/6)*point.y)
}
function turtle (angle, distance) {
    return new Point(Math.sin(angle)*distance, Math.cos(angle)*distance)
}

function randomColor () {
    var index = Math.floor(Math.random() * colors.length)
    return colors[index]
}

function face(pos, size, angle, itteration) {
    path = new Path(
        { strokeColor: new Color(0)
        , strokeWidth: 1
        , fillColor: randomColor()
        }
    )
    path.moveTo(pos)
    pos += turtle(angle, size.height)
    path.lineTo(pos)
    pos += turtle(angle + TAU*2/6, size.width)
    path.lineTo(pos)
    pos += turtle(angle + TAU*3/6, size.height)
    path.lineTo(pos)
    path.closePath()
    path.data.angle = angle
    path.data.itteration = itteration
    path.data.cycle = Math.random()
    path.data.position = path.position
    paths.push(path)
}

function quarter (pos, size, angle, displace, itteration) {
    var drawSize = size/2
    itteration += 1
    drawAt = pos + turtle(angle+TAU/6, drawSize.width) + displace
    maybe(drawAt, drawSize, angle, displace, itteration)
    drawAt = pos + turtle(angle, drawSize.height) + displace
    maybe(drawAt, drawSize, angle, displace, itteration)
    drawAt = pos + turtle(angle+TAU/3, drawSize.width) + displace
    maybe(drawAt, drawSize, angle, displace, itteration)
    var drawAt = pos + displace
    maybe(drawAt, drawSize, angle, displace, itteration)
}

function maybe (pos, size, angle, displace, itteration) {
    if (size.width < 10 || size.height < 10 || Math.random() < 0.5) {
        face(pos, size, angle, itteration)
    }
    else {
        quarter(pos, size, angle, displace, itteration)
    }
}

function side (angle) {
    var pos = center
    var size = new Size(250, 250)
    var displace = turtle(angle+TAU/6, 0)
    var itteration = 0
    face(pos, size, angle, itteration)
    quarter(pos, size, angle, displace, itteration)
}

function setup () {
    side(0)
    side(TAU * 1/3)
    side(TAU * 2/3)
    firstFrame = false
}
setup()

function animate () {
    if (firstFrame) return
    var slowness = 1000
    var factor = 15
    var len = paths.length
    for (var i = 0; i<len; i++) {
        var path = paths[i]
        var position = path.data.position
        var angle = path.data.angle
        var itteration = path.data.itteration
        var cycle = Date.now() / slowness
        cycle += path.data.cycle / 5
        var displace = Math.sin(cycle) * factor + factor
        var translate = turtle(angle+TAU/6, displace*itteration)
        path.position = position + translate
    }
}

onFrame = animate

