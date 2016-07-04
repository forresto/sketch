// WIP
// http://sketch.paperjs.org/#S/nVZLb9pAEP4rWy4xL4s8qkppyCVqb60qpVIPgNBiD2Bhdt21TaAJ/70zu2t7bUzShovNzPfNe3b93BF8C53bzuMGsmDdGXQCGdL/HVcsW0fBRkCasjG7HE0FydKMqwz/C3hiP2QkMu9qNGBXo65VR38AtTeINoKYLw4KYWs2ngqGv4lDvRwwIpJ44IjR4GWLeHgePizwM/I7FctcBFkkBdvB/qd8kFKFqYfvXfZscBRakCsFgpIxSfWqhA0o0DzUTyx0Zsmw95dSfeHB2is8kXWIu9a8Zlvz/THTulP7lQ8/ydO1Zxk2laN9KshyJSxwKo61/BQXodx+z8MVMK+WncK4v/Fs7RuIZ61FS+YpdsdG/tXHEu+4aW3Oscl9g+o08IT66Q3u8NRvm33d8XotBKxsIQQ9SjcFXet6yGwSM3WwxHJaBwY+YJEInbGhNLSE3VeT7ccgVjjgQ3bdltqSxynU8qH2zJ3FcEylcRRA0au5I0+0QvvG+tjwXsf1rw3SlsVWpUupF1HIIMiTCEKa8dnZzfCDWIoyKpx85hEqQj3ax+zxZd4sx2cW3eEbPvr9WlmIahbCZU2i2fnVqTTUAKv1DzRP7OWFVYJ7fQDV3LV3wulG0+y+aXb/brO6Snpcxk6QPXNK9isH9UCKpkw0dfb/bhsG0Hmmcmhbqar+zZ3gSRL/61aczHOxUGeZ1TZVvLbdceM7jb4ZPMURKv5UXE94+nnuBVC5wgAISIOdgsYVkjRTcgMPMpZ0gF4sYh5sLmq6X1FokixvxyG7qbN5Qtz0d84VXBSRFYMwqtVZiq8Kb2APdnTyl+eM3t/+Ow4dx4st2DQj7+b0G7sXBuVslO9t3odXu1drmeuh2VX94QCrLVaAbtv2lhmorrKCrdzBo2V4roqHYSkvTNJFgR82CwV8k9D9kXZuJ7PjXw==

var thickness = 10
var start = new Point(20, 20)
var size = 40

var labyrinth =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(0, -1)
    ]


function vexToCoords(vex) {
    var current = start * thickness
    coords = [current]
    vex.forEach(function(vexel){
        current += vexel * thickness
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

function negNudge (nudge) {
    return nudge * -1
}

function tryNudge (labyrinth, nudge, index) {
    if (index > labyrinth.length - 3) {
        return false
    }
    var _labyrinth = labyrinth.slice()
    _labyrinth.splice(index, 0, nudge)
    _labyrinth.splice(index+3, 0, negNudge(nudge))

    var occupied = []
    var current = start.clone()
    for (var i = 0, len = _labyrinth.length; i<len; i++) {
        var vexel = _labyrinth[i]
        current += vexel
        if (current.y < 0 || current.y > size) {
            return false
        }
        if (current.x < 0 || current.x > size) {
            return false
        }
        var index = current.y * size + current.x
        if (occupied[index]) {
            return false
        }
        occupied[index] = true
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

var draw = new Path(vexToCoords(labyrinth))
draw.closePath()
draw.strokeColor = 'black'
draw.strokeWidth = thickness - 4
draw.strokeCap = 'square'

var index = 0

function onFrame(event) {
    index++
    if (index > labyrinth.length - 3) {
        index = 0
    }
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
    if (!_labyrinth) {
        return
    }
    labyrinth = _labyrinth
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
}
