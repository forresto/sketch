// WIP
// http://sketch.paperjs.org/#S/rVZtb9MwEP4rVhGas6alHeNFZeULgg9IIKQh8aGJqixx26ipXTlO27H1v3N2nNhJ3G0M8iWJ7+65x+d78V2PRhvSm/Su10TEq57fi1ki/3cRR2KVxmtK8hxN0fhtQOVaLjhbk19pIlawajT66FIrpL8JSC5HlX7EBfxTskc/WEoFlgqvLnxUvr2AlopZdHPLQQ6wAUXwzCybsY9GXrnsW8sjH40dy4MT6qfWAWbgwrHUQ0kzoIuCxiJlFO3I4Sf7xBhPcgzfHror9eRO4oJzQuWmcbn7cxMnDRcrS9CYaeVQm5PDcMH45yhe4cqXxCeZpx0oa+2gDx6U0OHBeBlui3yFtY2WHvWbE1FwqhUDemzskUc0YZvvRbIkCDd2yIH5t0ishqUK1mjpAmGOrtBoePGm1rfcOCN7bNs+Ymqdecf03SO2g65fF75KhmYsKFkiTGUoag+VpYrPORi1bQS/1cGrc9sv1X2U0sTKGvUHMS3fL00tDDNCl2Jl9ll6m06NykwZha6NL6IsJ51Q1RCwJ9yBeRqOTIK5VbEW4zxLY1JlxNxa3yqBcgOnoCPhNQNQivuvPQjC3B2FByFhRyWsaisVUxbHxTYliay30FWnqkyHccZozRyqEIoLtFKQAzRQgI8Opw8ovYIvePX7jdBJ07I2batZGjrLWGkaiTwmLR3eoisggO7vkVn5qJpnw5/7uKwja+MeOriHZ+PaQZ5XZ2nonpdDoW88NSlVprMmRvj3RE4hyVHFC+KqfHM47fqNttvsqRXcKYiq+E9amoI0dq7is/l12bfJSx4Jj/bVxIUmjUuDO5ST5Qain08a08s4rwZgOeI/sYzxCTq7yaJ4fdaUfYVOCSLOCpq0ROpmMLF/atrgQFKTdZYTxawe/vsoW/8/yi8IIf/CGA3Qe5u1ZOdiXWX6qJE2S8721rxstjYogrHn7PCBkJC6OduzV/kTz0mwQDjSKxB1vtbUsBrmiwzCizstDu5owFqnu6MtS+m42QvmbqZzm2rdqn1NxKu4KdInikI+Nva8XR761AJxbJczo1843HUx2cl7UAVq+vx0JJv5xajby+WJ4ua1QV1tdXKi6YPZqXKekw3bkWttgW1RlCT1egWp5Srx3KZKdML0CNf4G06i9VbeaPLeZBYe/wA=

var thickness = 16
var strokeWidth = thickness + 4
var size = 40
var start = new Point(size/2, size/2)

var labyrinth =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(-1, 0)
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
    for (var i=0; i<20; i++) {
        grow()
    }
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
    walk.removeSegments()
    walk.addSegments(segments)
}
