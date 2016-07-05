// WIP
// http://sketch.paperjs.org/#S/tVfrb+o2FP9XLKapoYQA3bpJrEzaqu3bnSbdSftAEHITAy7Bjhynj/Xyv+/4ldhJuLd30qjUkOPz+Pm8eRsxfCKj5ejjkcjsMIpHGc/V+xMWSB5odmSkqtAK3XyfMkWrpOBH8jfN5QGoix8slf5DFNOtY8JCwjsjz+hPTpmMPmB5SDJCi0ixzm7GMdKkXcG5cLRxyox8gR9eBYiBiZQh+Kw9VYsYzceGHHvkeYwW7ydPL2i5RAc10wvqB+memo26Vcp2Ncsk5Qw9kZe/+D1cO68i+D5Gb4ZPXTyrhSBMuS4yPrxug2DVZVoSONYbNJutrcTG6iAvyY6L33B2iJxBZYQUY2tFq7BWJmBGHw6YaU0lZV0dIitjT8/2KYisBbOMKTsHFxWY5fz0R53vCYqCawqAr8NvWCKrje5QJNAdmic3tw2/Z2bQveeu7BdEvYToif74Bdlp3+6Qfp0RoS8Y2aOIKVc0Fpyk9s81CHVlpHi1zmvqITbsMaIs91JHv4FPzfPbtn6SgrC9PLT3NNZWq5ZlrYU2Qxff4aIiPVc1KuBOUU/N+/SoJNh6Ve4hrgqaEZcRW49e6gNtBqJgPTEOHWCOJ9+NwQnbYS98ViXcyKjVrcgh5VlWl5TkuuiGilXXapIVnDXIoQqhuICLwjmoBgjwpYfpJ0Tv4Bs8JpPAdUrU1KYvtaabwTLWnO2JCpM9TV7RHQBAnz6hlvKzbtiBveFweSHr6n3p6X35z3p9J29dLFu412a+TFpLISQnug51bL4eyCVNAEeKmgxVfhucbv3isizeW8G9gnDFf1GyLchWbqj4fHx99F3w5m82Q7/i7LgXvGY5yrmszFwWOKe1mj2wDAQJvoAEVvmg4hTmcsP2aNgeW7bHTsrrHqqmwj0VWUGiMHZvKIPQE7FEa+rPqxhUeq+bUCq2mJf22T3d0aK45wUHtVffEEKuQgYvNdq2f3ZrSnXAOX92ew4gt5DfUEX2J0ALZv1p38bJLQzQMiqSL73kiu2G5UA9FBCIq/BMb1/LYBWbqJBYfM0aVWKdSv8jOs9ll8H1gZ04O3rAwoC3ge6tQM6Si6nvgSlazN25H1XfgT4G12bm5vUZF8dtTsEky4ghe6UMlfDs7TDhuAHnL8aDUzeVSrUdmP4+pKaEOfzaok/lQMmnsukhDbTI2697YweWbUBtW9DAqFSni7A/b4eRbn2ozfiMLZCxw6ZBX2hU6uPr3nZblg1dKs/dFsvZ7wJ+v0TkSe2mvZ5DV3M1YBe3/fmqIhqFq5wuaVsaaPXZ2ij18kpO/Il8tBKRf4TzvKE7lf55deK8KUiT9PK1JJCuGZanuiimgp+8XgQpjTOp8hn2297ksppNO0q8Kxhb9t0wmf/dbI9CwgRphyY5KSSGArydqyzR2vxVSpVxUvKK6lhYc3si9SL8iwyVupUYfmI+CIKPpWKqRsv15vwv

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
