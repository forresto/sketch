// Drag path to make labyrinth
// Double-click to automatically fill

var spacing = 24
var strokeWidth = 16
var size = 25
var start = new Point(Math.ceil(size/2), Math.floor(size/2))
var auto_grow = false
var symmetry = true

var labyrinth =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(-1, 0)
    , new Point(0, -1)
    , new Point(0, -1)
    , new Point(1, 0)
    ]


function vexToCoords(vex) {
    var current = (start * spacing)
    coords = []
    vex.forEach(function(vexel){
        current += (vexel * spacing)
        coords.push(current)
    })
    return coords
}

function randomNudge () {
    var r = Math.random()
    if (r < 0.25) {
        return new Point(1, 0)
    }
    if (r < 0.5) {
        return new Point(0, 1)
    }
    if (r < 0.75) {
        return new Point(-1, 0)
    }
    return new Point(0, -1)
}

function neg (nudge) {
    return nudge * -1
}

function tryNudge (labyrinth, nudge, index) {
    index = index % labyrinth.length
    if (index === labyrinth.length - 1) {
        return false
    }
    var _labyrinth = labyrinth.slice()
    _labyrinth.splice(index, 0, nudge)
    index = (index + 2) % _labyrinth.length
    _labyrinth.splice(index, 0, neg(nudge))

    if (symmetry) {
        index = (index + _labyrinth.length/2 - 1) % _labyrinth.length
        if (index === _labyrinth.length - 1) {
            return false
        }
        _labyrinth.splice(index, 0, neg(nudge))
        index = (index + 2) % _labyrinth.length
        _labyrinth.splice(index, 0, nudge)
    }

    var occupied = []
    var current = start.clone()
    for (var i = 0, len = _labyrinth.length; i<len; i++) {
        var vexel = _labyrinth[i]
        current += vexel
        if (current.y <= 0 || current.y > size) {
            return false
        }
        if (current.x <= 0 || current.x > size) {
            return false
        }
        var occupied_index = current.y * size + current.x
        if (occupied[occupied_index]) {
            return false
        }
        occupied[occupied_index] = true
    }
    return _labyrinth
}

function applyNudge (labyrinth, nudge, index) {
    var _labyrinth = tryNudge(labyrinth, nudge, index)
    if (_labyrinth) {
        return _labyrinth
    }
    return labyrinth
}




// Background dots
var radius = 4
for (var i = 1; i <= size; i++) {
    for (var j = 1; j <= size; j++) {
        new Path.Circle(
            { center: [i * spacing, j * spacing]
            , radius: radius
            , fillColor: '#eee'
            }
        )
    }
}

var shadow = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: 'black'
    , strokeWidth: strokeWidth + 4
    , strokeJoin: 'round'
    }
)

var path = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: '#eee'
    , strokeWidth: strokeWidth
    , strokeJoin: 'round'
    }
)

var index = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
        labyrinth = _labyrinth
        return true
	}
	return false
}

var redraw = false
function onFrame(event) {
    if (auto_grow) {
        if (grow()) {
            redraw = true
        }
    }
    if (!redraw) {
        return
    }
    var segments = vexToCoords(labyrinth)
    path.removeSegments()
    path.addSegments(segments)
    shadow.segments = path.segments
    redraw = false
}

path.onMouseDrag = function (event) {
    var index = path.getNearestLocation(event.point).index
    var dx = event.delta.x
    var dy = event.delta.y
    var nudge
    if (dy === 0) {
        if (dx < 0) {
            nudge = new Point(-1, 0)
        } else {
            nudge = new Point(1, 0)
        }
    }
    if (dx === 0) {
        if (dy < 0) {
            nudge = new Point(0, -1)
        } else {
            nudge = new Point(0, 1)
        }
    }
    if (nudge) {
        var _labyrinth = tryNudge(labyrinth, nudge, index + 1)
        if (_labyrinth) {
            labyrinth = _labyrinth
            redraw = true
        }
    }
    console.log(index, nudge)
}

view.onDoubleClick = function () {
  auto_grow = !auto_grow
  path.strokeColor = auto_grow ? 'lightgreen' : '#eee'
}
