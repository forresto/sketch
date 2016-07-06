// WIP
// http://sketch.paperjs.org/#S/tVfra+s2FP9XtIxRu3GcpKwbZM1gK9uHwcbgDvYhDkG1lUSNIwVZ7mO9+d939LIl27n3drAU6vjoPH4677yNGD6S0WL04UBkvh8lo5wX6v0JCyT3ND8wUlVoiW6+zZiiVVLwA/mbFnIP1Pl3lkr/IYrp1jFhIeGdkWf0J6dMRr9juU9zQstIsU5v4gRp0rbkXDhanDEjX+KHVwFiYCJjCD4rT9U8QbPYkBOPPEvQ/MvJkwtaLtFBzeSC+kG6p2atbpWxbc1ySTlDT+TlL34P1y6qCL7H6M3wqYvntRCEKddFxofXbRCsulxLAsdqjabTlZVYWx3kJd1y8QvO95EzqIyQMrZWtAprZQxm9OGAmdZUeqqrfWRl7OnZPgWRtWCWMWPn4KICs4If/6iLHUFRcE0B8HX4DUtktdEtigS6Q7P05rbh98wMuvfclf2MqJcQPdHvPyM76dsd0q8zIvQFIzsUMeWKxoKT1P65BqGujBSv1nlNPSSGPUGUFV7q6DfwqXl+09ZPWhK2k/v2npZzuezxoAn4ZeD2W1xWJLiyiuDGK1FPVVXSnLhwbjz6SR9o6+BCe404RG/BjdFNDHfYDF/ik0rJzvpYdxKHled5faKk0DUzVGu61NK85KzBDkUEtQFcFM5BNUCALz1MPyB6B9/gMR4HzlOiprR8qRVdD1ah5mxPVKDsafqK7gAA+vgRtZQfdb8N7A0HzAtaV+9LT+/Lf9brO3njotnCvTbjYdxaCiE50VWoY/1+IJc0ARwpajJUuG1wuuWHT6fySwuwVxKudi9KtiXZyg2Vn4+vj74L3vxNp+hnnB92gtesQAWXlRmrAhe0VqMDZnmQ4HNIYJUPKk5hLjdsj4btsWV77KS8boGqqd9TkZckCmP3hnIIPRELtKL+uElApfe6DqUSi3lhn93TLS3Le15yUHv1NSHkKmTwUqPt2me3ZVR7XPBnt6YAcgv5DVVkdwS0YNYf1m2c3LyHllGRYuElV2IXJAfqoYRAXIVnenlaBJvUWIVE8UDoHNtvME5Agw7iVYO+2ZFOWCfa/4jdc+hl6O+FfeTs4MEOk6VNkt7243C4fPC9B5Nr5s79jPCd72NwLWpmXp9xedgUFEyynBiy1wagip699aU3rObx4MDNpFJthvvSX4XUhDGH720YmRxoF5ls+k8DLfJW697Igj0bUNv2NTBm1ek87O2bYaQbH2ozehMLJHbYNOgLTU59fN2bbrvrdMM2WW1MM6n/hZMh7OOc/SrgN05EntT+6qx3gx6FhDHS7GlBSokhD29nylmq5oJtRGVzeuIV1ZaWhmFHpF4Ff5Kh0mApEaQQWDUfb5q1PXk5U5vF/La/WChvqpSM4oHxaFX2vOQ9lPxXhnNg3PT2PNdN0PKT7UTfW5AjfyIfrETkH+GiaOhOpX9eHTlvepjpBPL1RKCGcyyPdVlOBD96zR3qHOdSFTns+72rWs2mv6feFYwt+67zBH7wPgiCDycVsGq0WK3P/wI=

var thickness = 24
var strokeWidth = 16
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

var shadow = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: 'black'
    , strokeWidth: strokeWidth + 4
    // , strokeJoin: 'round'
    }
)

var path = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: '#eee'
    , strokeWidth: strokeWidth
    // , strokeJoin: 'round'
    }
)

var monk = new Path.Circle(
    { center: start * thickness
    , radius: strokeWidth - 10
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
    walk_distance = (walk_distance + event.delta * 50) % path.length
    monk.position = path.getPointAt(walk_distance)

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
    path.smooth(
        { type: 'catmull-rom'
        , factor: 0.5
        }
    )
    shadow.segments = path.segments
}
