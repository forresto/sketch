// WIP
// http://sketch.paperjs.org/#S/rVdbb9owFP4rFtPUpAQK3apNrOxh1fYwadOkTtoDQShNDLgEGzkJ0FH++44dO7ET03XV4CHE5/b53Dl0aLTGnVHndoXzeNkJOjFLxPs24ihfknhFcZahMbp8G1JxluWcrfAvkuRLOK05ukgzkN9Y8F9p/ojn8E7xDv1ghObetyhf9mNMUk+wXlz6AZJH85Qxrs/8kJbyaXT3wEEMrIUUwWdiqBoGaOCXx4FxPAjQ8PnHvRNaTp2Dmt4J9c5zQ81U3Cqk84LGOWEUbfH+J7uBayeZB799dCj5xMXjgnNMheu80ofntbeVulhKAsdEMU+VON7354x/juKlp20J/Tj1lQEprQx0wYIkOizUVvqbIlt6SkZRj+rJcV5wqhhDerTuyCOasPX3Illg5Fk35IBcRr5k8ZQ2MkceR9do0L+8qvgNM07PHpuyfxE1cqEl+u4vsr22XZd+mQy2LyheII8KV1QWtKT0zzkINWVy/qCcV5VCULIHiNDEyBr5Bj4tn6/r0umnmC7yZX3P0tp4XLNMpNDUdfF5lGa45apKBdzJa6l5nh6RBDOjwA3EWUpirDNiZpxvJEGagSgoT/i2A0py940PTpi5vfCkSrhRqVZ2IY2UxXGxITgR9TZ11aks036cMlohhyqE4gIuAnRQDRDgRwvTB0Su4Rc8ul3LdUK0rE1TakKmzjKWnDVFhElR+w/oGgCgx0dUn3yUvdqy5w6XEbKm3n1L7/7Fek0nz3Qsa7jn5Wjp1pZsSFp0YuuY/juQU5rEwOMFdlV+HZxm/UabTfrcCm4VhC7+k5J1QdZyruIz8bXRN8GX34sL9CmKVwvOCpqU05hHCSnExIFhb+X2EHJXpIIIkZ3GFdt9yXZfs903sl22TzEQbgiPU+zZYTugGKKO+QhNiDmqAlBpvE5tqUBhHqlnkzonaXrDUgZqz15hjM9sBiMr6o5/1MtJwqOd3m0AtwJ8QBlerAErGDUnfB0gvSSUy5Q2f5eCt89s2leYJkCSIWiQ5A42Ml8qgGBAQBO9KMMSWbVP7aJ09f8gGx57EWLUQ+9N1AKdC7XuBgOrtCAzd8ZOYbd/aBRD3zkFw1yoVAPM3E+kvfwlRRjmjhIM86qmK2ieseq2xgDsvYBatQTH6BLUod0vZ26kMxNqNc4CBcTX2CToE41DfEzds2YLUVEL82Oz5TH6hcO/Cg9vxa7YagRkPBADb3jVnnciop69Wsk/ESo50fjJ7JQ5z/GabfGtkvBMUpQk1blWqegy8dyiknRCVN4b/jTdcRytNmLzyzqjyfT4Bw==

var thickness = 24
var strokeWidth = thickness + 4
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
    coords = [current]
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
    if (nudge == labyrinth[index]) {
        return false
    }
    if (nudge == neg(labyrinth[index])) {
        return false
    }
    var _labyrinth = labyrinth.slice()
    _labyrinth.splice(index, 0, nudge)
    index = (index+3) % _labyrinth.length
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




// Background
var radius = 4
for (var i = 1; i <= size; i++) {
    for (var j = 1; j <= size; j++) {
        new Path.Circle(
            { center: [i * thickness, j * thickness]
            , radius: radius
            , fillColor: '#eee'
            }
        )
    }
}

var draw = new Path(
    { segments: vexToCoords(labyrinth)
    , strokeColor: 'black'
    , strokeJoin: 'round'
    , strokeWidth: strokeWidth
    }
)
draw.closePath()

var walk = new Path(
    { segments: vexToCoords(labyrinth)
    , strokeColor: '#eee'
    , strokeJoin: 'round'
    , strokeWidth: strokeWidth - 8
    }
)
walk.closePath()

var index = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
	    var _index = ((Math.floor(_labyrinth.length/2) + index) % _labyrinth.length) + 1
        var __labyrinth = tryNudge(_labyrinth, neg(nudge), _index)
	    if (__labyrinth) {
            labyrinth = __labyrinth
        }
	}
}

function onFrame(event) {
    for (var i=0; i<15; i++) {
        grow()
    }
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
    walk.removeSegments()
    walk.addSegments(segments)
}
