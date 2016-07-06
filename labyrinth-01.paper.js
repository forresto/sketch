// WIP
// http://sketch.paperjs.org/#S/tVdtb+JGEP4rW6oKOxgI6KKeaKjURu2Hk1pVukr9AAg59gIb7F20XpPQHP+9s2/2rm2So9IFKeDZmWded2b82qNxjnuz3uc9FsmuF/USlsrnY8yR2JFkT3FRoDmaflhSSSsEZ3v8D0nFDqiTj4ZK/sWS6c4yxVzAM8XP6C9GqAj+iMVulGCSBZJ1PA0jpEibjDFuaaGRPuU5FvwEAIKXeEk1OYsfTxywQO+SIvhbOPiTCN2Gmhw55NsITb6ePLyAcokOMMML8J10B2YlvVrSTUkTQRhFR/zyN3uAWKRFAL9D9Kr5pONJyTmmMp6BDuxNnRkDlyhJ4Fis0Hi8MBIrg4FfRhvGf4uTXWAVSiU4C40WBWG0DECNOuxQU6saHcpiFxgZc3o23xyLklPDuKRnz1Ee05Tlf5bpFqPAc5OD+aomNEtg0MgGBRzdo9vR9K7id9R0hvfclH1H1CmIluiP78gO23q78FVF+LGgeIsCKkNRabCSKj43INSUgXthglfdh0izR4jQ1Ckd9QQx1d8/1PdnlGG6FbvaT8M5n7d40BDi0uH9Js4K7LksM7h2rqgDVWQkwTada4d+UAdKO4TQuBH61hvjBmgagg/rbifeBMVbE2ODXPttG43nYUtxS+d4qsNy0Zx2XFuMrcB2B9cJ8NV+Xh3Fa9KjitLmnSVJeSA4Vf2nq2+ptjVKMkarOoCGBH0GuAicAzgYgjri9BMi9/ALvgYDL15SVLcpV2pBVp0dTXH6yTGnoxO6BwPQly+opvysBtr1+XFxX1q4L/8b1w3y2ua0NvdGz99Brck3yYoufIzV9YZcQqpGtcNvwOrkNFtZfDhkX9vMWu3F9sGLkvU1r+W6WplrX9v6pvH6Mx6jX+Nkv+WspClKmYAx5xX0BApW5l/mxa/diu1Jsz3VbE+NElfjQw7EB8KTDAd+rl5RAqnGfIYWxB3VEUA6jytfKoIBnJKymKEPzYMNybIHljFA7H+PMe77DE4V1D3gbJezYhen7NmufGC0sfYVFXibg6Gg0d1x6pTYNQm6Q4HTmVNHkVk2rVGPGcS875+pRXTmbaUD65rl+QQjGMRVsvqV6aE1/RCrgvqGhjvRvGz3VTbnjO7X38LwIynIY4ZnjQnvKXZ0+qVZl2RrT7X4jerzq85NsKvUdrxb/fgcZ/t1SkAHTbAmO10FLuWzs1m2JqAa3O0BuBQSWu9dc3dLlQNLH17bf5bije7jYjVbkNN/zAuQkBdN+O3Zb6aM/s7hTS7AR7mQu23zEKsoqdW6IFRzjATJ5YL5MYR/k6mMi0lJM7qBTxggA5DiTMQgLOFDGdOqJr2lQlJHB1YQZeXc4dpioZbjX4SvInRXC45THsu+4tRj3Wnnt3I/mNy11wMZeVkJQdgx5AxkXfdOf3PW/+80Z8fQaG2+9sqh+Zt3TvnNcc6O+LORCNyjOE0ruoU057rBjhxFSsI+18Fee/R3+XLGqtah77A4HeD+95NY5GWWDTnLnUkAFzZOhLyt8E7VCp5+w+lFvUeO4/1BZrfozRar838=

var thickness = 24
var strokeWidth = 18
var size = 25
var start = new Point(Math.ceil(size/2), Math.floor(size/2))
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
        labyrinth = _labyrinth
        return true
	}
	return false
}

function onFrame(event) {
    var pace = Math.sin(event.time * 8) * 12 + 14
    walk_distance = (walk_distance + (event.delta * pace)) % monk_path.length
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
