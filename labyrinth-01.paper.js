// WIP
// http://sketch.paperjs.org/#S/tVfrb+o2FP9XLKapoYQA1XonsTJpq7ZvmybdSfcDQchNDLgEO3KcPtbL/77jV2In4d7eSaNSQ47P4+fz5m3E8ImMlqOPRyKzwygeZTxX709YIHmg2ZGRqkIrdPNDyhStkoIfySeaywNQFx8slf5DFNOtY8JCwjsjz+gvTpmM/sDykGSEFpFind2MY6RJu4Jz4WjjlBn5Aj+8ChADEylD8Fl7qhYxmo8NOfbI8xgt3k+eXtByiQ5qphfUD9I9NRt1q5TtapZJyhl6Ii9/83u4dl5F8H2M3gyfunhWC0GYcl1kfHjdBsGqy7QkcKw3aDZbW4mN1UFekh0Xv+HsEDmDyggpxtaKVmGtTMCMPhww05pKyro6RFbGnp7tUxBZC2YZU3YOLiowy/npzzrfExQF1xQAX4ffsERWG92hSKA7NE9ubht+z8yge89d2a+IegnRE/3xK7LTvt0h/TojQl8wskcRU65oLDhJ7Z9rEOrKSPFqndfUQ2zYY0RZ7qWOfgOfmuf3bf0kBWF7eWjvaaytVi3LWgtthi6+w0VFeq5qVMCdop6a9+lRSbD1qtxDXBU0Iy4jth691AfaDETBemIcOsAcowm6GYMbtsN++KJSuJNRrJuRw8qzrC4pyXXZDZWrrtYkKzhrsEMdQnkBF4VzUA0Q4EsP00+I3sE3eEwmgfOUqKlOX2pNN4OFrDnbExUoe5q8ojsAgD5/Ri3lZ92yA3vDAfOC1tX70tP78p/1+k7eumi2cK/NhJm0lkJITnQd6th8O5BLmgCOFDUZqv02ON0KxmVZvLeGeyXhyv+iZFuSrdxQ+fn4+ui74M3fbIZ+xdlxL3jNcpRzWZnJLHBOazV9YB0IEnwBCazyQcUpzOWG7dGwPbZsj52U111UzYV7KrKCRGHs3lAGoSdiidbUn1gxqPReN6FUbDEv7bN7uqNFcc8LDmqvviOEXIUMXmq0jf/sFpXqgHP+7DYdQG4hv6GK7E+AFsz6876Nk1sZoGVUJF96yRXbHcuBeiggEFfhmd6/lsEyNlEhsfiaRarEOpX+R3Seyy6D6wM7cXb0gIUBbwPdW4KcJRdT3wNTtJi7cz+qvgN9DK7NzM3rMy6O25yCSZYRQ/ZKGSrh2dtiegNnMR6cu6lUqu3I9DciNSXM4bcWfSoHSj6VTQ9poEXeht0bO7BuA2rbggZGpTpdhP15O4x060NtxmdsgYwdNg36QqNSH1/3ttuybOhSee62WM5+F/ALJiJPajvt9Ry6mqsBu7jtz1cV0Shc5nRJ29JAqy/WRqnXV3LiT+SjlYj8I5znDd2p9M+rE+dNQZqkl68lgXTNsDzVRTEV/OT1IkhpnEmVz7Dh9iaX1WzaUeJdwdiy74bJ/O9mexQSJkg7NMlJITEU4O1cZYnW5q9SqoyTkldUx8Ka2xOpV+FfZKjULcXwI/NBEHwsFVM1Wq43538B

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
    if (nudge == labyrinth[index]) {
        return false
    }
    if (nudge == neg(labyrinth[index])) {
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
    }
)

var path = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: '#eee'
    , strokeWidth: strokeWidth
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
        }
	}
}

function onFrame(event) {
    for (var i=0; i<15; i++) {
        grow()
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
    
    walk_distance = (walk_distance + event.delta * 50) % path.length
    monk.position = path.getPointAt(walk_distance)
}
