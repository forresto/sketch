// WIP
// http://sketch.paperjs.org/#S/nVdZb9s4EP4rhBdFpFjxkW1awI370KB9WGDbBbpAHyzDYCTaZiyTBkXl2NT/fYeXREpym9Z5kDQ3Z+bjTJ4HDO/JYDb4uiMy2w6SQcZz9X2PBZJbmu0YKUs0R5evU6ZopRR8R77RXG6BOnVU+h9RQldOCAsJ34w8oH84ZTL6G8vtKCO0iJTo+DJOkCatC86Fo8UpM/oFvn0SoAYuUobgt/BMTRM0iQ058ciTBE1fTr44YeUUHcxcnDDfS/fMLNWpUrauWCYpZ+iePP7Lb+DYeRnBe4yejZw6eFYJQZhKXWRyeN4UwZrLtCZILJZoPF5YjaW1QR5Hay4+4mwbOYfKCSli60WbsF6G4EYze9w0rkaHqtxGVsdyj/YpiKwEs4IpOwYHFZjlfP+5yjcERcExBYSvy29EImuNrlEk0DWajC6vannPTW96j23dn6h6DdFRffsT3Yuu3z77uiPCXDCyQRFTqag9OE2dn3NQautI8WSTV+MhMeIJoiz3Wkd/QU7N81WDn1FB2EZum3Mab/N5I7LQSsu+g69xUZJOqmoTcKaoY+ZldlQTrDyUexGXBc2I64iVRz9ohnYDVbCZiMMEGPbwzxiSsOrPwg9NwomMWX0VuUh5llUHSnINuj6waqyOsoKzOnJAIYALpCjwwTSEAC+dmN4heg1v8BgOg9QpVYNNX2tBl70w1pINR5XJckdP6BoCQN+/o4byXl/Ygb/+cnkla9t97Nh9/G27fpJXrpZNuOdmvgwbT2FITnUR2lj+eiCnLEE4UlSkD/lNcdr4xYdD8VIEdwDhwH9SswFko9cHPj++bvTt4M3feIw+4Gy3EbxiuRnJAue0UmMHJn7Q21PoXdUKqkRhG9did0bsrhG7a3W7vj7VQLihIitIFJbtGWVQdSJmaEH9UZWASe9zGWolNuaZfba5a1oUN7zgYPbsD0LIWSjgdUVz4x/dhpIL/OAWHIjbBvyMSrLZQ6zg1B/zTYHcpgB3RUnymddViV2tekKCcjjuXzBjgKkLcxYq6p1s5n/U/C3O+YMzfFtAac9C3oeiAtabkPhlvS6JnIWzzRt/9brmEDsJ2h+658Gb++EVDWCexr2TKpXKpB0y/g6hblbD/FWgpLIHJqmscVeHFnk7aeeqhgUVoraw7RkvijsN77RVf6QrP9R65CQ2kNjFpoM+AW71822v2jC3NUrlsX0tcfZJwM4fkXu1z3XASucTNZSmV92ZpCoaheuP3vZtz6P5D5teQWYkyJ7fk69WI/JZOM9rujPp88s95zXSDNrk04FAR2dY7quiuBB874EYEI4zqVoedsLObe82NPiP51YQvDuoBi8Hs8Xy+D8=

var thickness = 24
var strokeWidth = 14
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
    , closed: true
    , strokeColor: '#eee'
    // , strokeJoin: 'round'
    , strokeWidth: strokeWidth
    , shadowColor: 'black'
    , shadowBlur: 6
    , shadowOffset: new Point(0, 0)
    }
)

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
    draw.smooth(
        { type: 'catmull-rom'
        , factor: 0.5
        }
    )
}
