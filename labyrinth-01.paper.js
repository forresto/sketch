// WIP
// http://sketch.paperjs.org/#S/tVdbb+JGFP4rU6oKOxgD0aataKjURt2HSq1W2kp9AGQ59gATzIw1HkjSLP99z9zsGdtsNpWWSAGfOZdvzt0vA5oe8GA++LjHItsNokHGcvl8SjkSO5LtKa4qtEDX71ZU0irB2R7/S3KxA+rsZ0Ml/2HJdGOZUi7gmeJH9IERKoK/UrGLM0yKQLJOrsMIKdKmYIxbWriiWr5I7585iIGJFUXwWTqqZhGahpocOeRphGZfTx5f0HKJDmrGF9T30h01a3mrFd0caSYIo+iEn/5hd3DtvArgd4heNJ+8eHbkHFPpukD78KoJglGXKUngWK7RZLI0EmujAz/FG8b/SLNdYA1KI7gIjRWlwlgZgRl12GOmMRWXx2oXGBlzejbfHIsjp4ZxRc/eRXlKc3b4+5hvMQq8a3KAr8KvWQKjjWxQwNEtmsbXNzW/Y6bXvee27CuiTkJ0RH96RXbctdunX2WE7wuKtyig0hW1BSup/HMFQm0ZwZ+N8+p6iDR7hAjNndRRT+BT/f1DUz9xgelW7Jp7Gs7FosODxuCXnttv0qLC3pVlBBOnRB1VVUEybMOZOPRSHSjr4EJzjdBHb8CN0HUId0j6L/FFpXhrfKw6icXKsuxYEpyrmumrNVVqcVYwWmOHIoLaAC4C56AaIMCPDqZfELmFX/A1GnnOk6K6tFypJVn3VqHibE5koMxp/IxuAQD69Ak1lF9Vv/Xs9QfMCVpb71NH79P/1us6ObHRbOBe6fEwaiz5kKzo0texfjuQS5oAjuBH3Fe4TXDa5ZeWZfG1BdgpCVu7FyWbkmzk+srPxddF3wav/yYT9Hua7becHWmOciagNXsJPYOElfGXcfFzt2Z70GwPDdtDK8VVy5NN/I7wrMCBH6sXlEGoMZ+jJXHHSwQqnce1LxXB0MjJsZqjd+2DDSmKO1Yw0Dj8HmM89BmcLGga9NkuFNUuzdmj3UgAtEH7giq8PQBQsOjO5SYkdrRDd6hwPnfyKDK7kAV1X4DPh/6Z2pPm3tI0slezPH/C2ABxFaxhDb3ehcpUJdQ3BO548zLuN2E+MLpPvgXwE6nIfYHnrankGXZs+qnZpGRnt7L6W9nnZ50bYNeo7XhT/fiYFvskJ2CDZliTna4CRfnobEOd2TcLe+f3SkjVeldYuJuVHFj68K39ZyV6us9K1O2shhY4m3pnAsLaDqhNN+yZ2vJ05o+KpB9p4kKtJ3lkgIQWmwJ9oWfKj6s7aXdP+zHts0ktE9OVUP/8QeOPBUbfc3hlCvBJrsPuAKgELtVLEOzler2tCNV8sSAHueT9GMK/2VT65FoLtrMl8AkjpOVzXIhUTlKwIf0si8vbi2TmxyWriAK5aEow3mKhNtPfhK/b25E4znkqG6RTWM3IWEzlojO76e45MhoypYOwZ1oblR0vO19S/jvN2TP9Omun7R1o8cXmoe7N8YGd8EcjEbhHaZ7XdKvSnOtJETuGlIR9bpydePRX+Q6M1T1QNyPxXEIjG2apOByLYszZwRlp0HnSTMi2Ay80Hefp1wt4Wb/nON2XMrrVYL5cnz8D

var thickness = 24
var strokeWidth = 18
var size = 25
var start = new Point(Math.ceil(size/2), Math.floor(size/2))

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
    var current = (start * thickness)
    coords = [] //[current]
    vex.forEach(function(vexel){
        current += (vexel * thickness)
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
for (var i = 1; i <= size; i++) {
    for (var j = 1; j <= size; j++) {
        new Path.Circle(
            { center: [i * thickness, j * thickness]
            , radius: 4
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

var monk_path = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , visible: false
    }
)

var monk = new Path.Circle(
    { center: start * thickness
    , radius: 4
    , fillColor: 'black'
    }
)

var index = 0
var walk_distance = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
	    var _index = ((Math.floor(_labyrinth.length/2) + index) % _labyrinth.length) + 1
        var __labyrinth = tryNudge(_labyrinth, neg(nudge), _index)
	    if (__labyrinth) {
            labyrinth = __labyrinth
            return true
        }
	}
	return false
}

function onFrame(event) {
    var step = 25 // Math.sin(event.time * 6) * 10 + 12
    walk_distance = (walk_distance + event.delta * step) % path.length
    monk.position = monk_path.getPointAt(walk_distance)

    var redraw = false
    for (var i=0; i<15; i++) {
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
    monk_path.segments = path.segments
    monk_path.smooth(
        { type: 'catmull-rom'
        , factor: 0.5
        }
    )
}
